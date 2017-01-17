const angular = require('angular');
const d3 = require('d3');
const randomColor = require('randomcolor');

require('./multiline-chart.scss');

const colorMapping = Object.create(null);

angular.module('angular-multiline-chart', [])
  .directive('checkboxIndeterminate', function () {
    return {
      restrict: 'A',
      link(scope, element, attrs) {
        scope.$watch(attrs.checkboxIndeterminate, value => {
          element.prop('checked', !!value);
          element.prop('indeterminate', value == null);
        });
      }
    };
  })
  .directive('multilineChart', function () {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        dataset: '=',
        valueDomain: '&',
        title: '@',
        specifiedTime: '&',
      },
      template: require('./multiline-chart.html'),
      link(scope, element, attr, ngModel) {
        const dataset = scope.dataset.data;
        const svg = d3.select(element[0].lastElementChild);

        const width = svg.node().clientWidth;
        const itemHeight = Math.max(120, svg.node().clientHeight);
        svg.attr('width', width).attr('height', itemHeight);
        const g = svg.select('g');
        const scaleX = d3.time.scale()
          .range([0, width]);

        dataset.forEach(x => {
          if (x.__checked == null) x.__checked = true;

          x.__color = randomColor({ seed: colorMapping[x.name] || (colorMapping[x.name] = (Math.random() * 10000) | 0), luminosity: 'dark' });
          const domain = x.domain || scope.dataset.domain || scope.valueDomain();
          if (!domain) throw new TypeError('Value domain expected');
          x.__scaleY = d3.scale.linear()
            .domain(domain)
            .range([itemHeight * .1, itemHeight]);
        });

        const indicator = svg.select(':scope g.indicator');
        const timelabel = indicator.select(':scope .time-label');

        const timeFormatter = d3.time.format('%X');

        svg.on('mouseover.timeLabel', function () {
          timelabel.classed('hidden', false);
        });
        svg.on('mousemove.timeLabel', function () {
          const [x, y] = d3.mouse(this);
          timelabel
            .attr('transform', `translate(${x > width - 80 ? -80 : 16} ${y - 9})`)
            .select('text').text(timeFormatter(scaleX.invert(x)));
        });
        svg.on('mouseout.timeLabel', function () {
          timelabel.classed('hidden', true);
        });
        (attr.baseElement ? d3.select(attr.baseElement) : svg).on('mousemove.' + scope.dataset.name, function () {
          const [x] = d3.mouse(svg.node());
          if (x < 0 || x > width) return;

          indicator.attr('transform', `translate(${x} 0)`);
          const circles = indicator.selectAll('circle')
            .data(dataset);

          circles
            .attr('cy', (d, i) => {
              const path = g.node().children[i];
              let end = path.getTotalLength();
              let beg = end / 2;

              dataset[i].__current = undefined;

              while (Math.abs(beg - end) > .01) {
                const point = path.getPointAtLength(beg);
                switch (Math.sign(Math.trunc(point.x - x))) {
                  case 0:
                    dataset[i].__current = dataset[i].__scaleY.invert(point.y);
                    return point.y;
                  case -1:
                    beg = (beg + end) / 2;
                    break;
                  case 1:
                    end = beg;
                    beg = end / 2;
                    break;
                }
              }
            });

          scope.$digest();
        });

        const genPath = d3.svg.line()
          .interpolate('monotone')
          .x(t => scaleX(t[0]))
          .y(function (t) { return this(t[1]); });

        scope.genPath = d => genPath.call(d.__scaleY, d.value);

        const specifiedLine = (time => {
          if (time) {
            return svg.append('line')
              .attr('x1', scaleX(scope.specifiedTime()))
              .attr('x2', scaleX(scope.specifiedTime()))
              .attr('y1', 0)
              .attr('y2', '100%')
              .attr('stroke-width', 2)
              .attr('stroke', 'green')
              .attr('class', 'specified-time-line');
          }

          return null;
        })(scope.specifiedTime());

        ngModel.$render = () => {
          if (ngModel.$viewValue == null) return;
          scaleX.domain(ngModel.$viewValue);

          svg.selectAll('.paths path')
            .data(dataset)
            .attr('d', scope.genPath);

          specifiedLine && specifiedLine
            .attr('x1', scaleX(scope.specifiedTime()))
            .attr('x2', scaleX(scope.specifiedTime()));
        };
      },
      controller($scope) {
        const dataset = $scope.dataset.data;

        $scope.isAllChecked = () => {
          let allChecked = dataset[0].__checked;
          dataset.some(x => {
            if (x.__checked !== allChecked) {
              allChecked = null;
              return true;
            }
          });
          return allChecked;
        };

        $scope.toggleCheckAll = ($event) => {
          const target = $event.target.checked;
          dataset.forEach(x => x.__checked = target);
        };
      }
    };
  })
  .directive('multilineChartAxis', function () {
    return {
      restrict: 'E',
      transclude: true,
      require: 'ngModel',
      scope: false,
      template: '<div class="line-chart-leftpart" ng-transclude></div><svg></svg>',
      link(scope, element, attr, ngModel) {
        element = element[0];
        const svg = element.lastElementChild;
        const width = svg.clientWidth;

        const scaleX = d3.time.scale()
          .range([24, width - 24]);

        const dateFormatter = d3.time.format('%Y-%m-%d');
        const timeFormatter = d3.time.format('%H:%M');

        const xAxis = d3.svg.axis()
          .scale(scaleX)
          .orient('top')
          .tickFormat(d => {
            if (d.getHours() === 0 && d.getMinutes() === 0) {
              return dateFormatter(d);
            } else {
              return timeFormatter(d);
            }
          })
          .ticks(9)
          .tickSize(6);
        const gAxis = d3.select(svg)
          .attr('width', width)
          .attr('height', 24)
          .append('g')
          .attr('class', 'axis')
          .attr('transform', 'translate(0 22)')
          .call(xAxis);

        ngModel.$render = () => {
          if (ngModel.$viewValue == null) return;
          scaleX.domain(ngModel.$viewValue);
          gAxis.call(xAxis);
        };
      }
    };
  });

module.exports = 'angular-multiline-chart';
