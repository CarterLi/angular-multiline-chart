const angular = require('angular');
const angularMultilineChart = require('angular-multiline-chart');

require('./index.scss');

angular.module('app', [ angularMultilineChart ])
  .controller('RootController', function () {
    this.datasetComputers = [
      {
        name: 'Chart1',
        data: [
          {
            name: 'China',
            filter: x => x | 0,
            value: [[new Date(2000,0,1),11920],[new Date(2001,0,1),13170],[new Date(2002,0,1),14550],
                    [new Date(2003,0,1),16500],[new Date(2004,0,1),19440],[new Date(2005,0,1),22870],
                    [new Date(2006,0,1),27930],[new Date(2007,0,1),35040],[new Date(2008,0,1),45470],
                    [new Date(2009,0,1),51050],[new Date(2010,0,1),59490],[new Date(2011,0,1),73140],
                    [new Date(2012,0,1),83860],[new Date(2013,0,1),103550],]
          },
          {
            name: 'Japan',
            filter: x => ((x * 10000) | 0) / 100 + '%',
            value: [[new Date(2000,0,1),47310],[new Date(2001,0,1),41590],[new Date(2002,0,1),39800],
                    [new Date(2003,0,1),43020],[new Date(2004,0,1),46550],[new Date(2005,0,1),45710],
                    [new Date(2006,0,1),43560],[new Date(2007,0,1),43560],[new Date(2008,0,1),48490],
                    [new Date(2009,0,1),50350],[new Date(2010,0,1),54950],[new Date(2011,0,1),59050],
                    [new Date(2012,0,1),59370],[new Date(2013,0,1),48980],]
          },
        ]
      },
      {
        name: 'Chart2',
        data: [
          {
            name: 'China',
            filter: x => x | 0,
            value: [[new Date(2000,0,1),11920],[new Date(2001,0,1),13170],[new Date(2002,0,1),14550],
                    [new Date(2003,0,1),16500],[new Date(2004,0,1),19440],[new Date(2005,0,1),22870],
                    [new Date(2006,0,1),27930],[new Date(2007,0,1),35040],[new Date(2008,0,1),45470],
                    [new Date(2009,0,1),51050],[new Date(2010,0,1),59490],[new Date(2011,0,1),73140],
                    [new Date(2012,0,1),83860],[new Date(2013,0,1),103550],]
          },
          {
            name: 'Japan',
            filter: x => ((x * 10000) | 0) / 100 + '%',
            value: [[new Date(2000,0,1),47310],[new Date(2001,0,1),41590],[new Date(2002,0,1),39800],
                    [new Date(2003,0,1),43020],[new Date(2004,0,1),46550],[new Date(2005,0,1),45710],
                    [new Date(2006,0,1),43560],[new Date(2007,0,1),43560],[new Date(2008,0,1),48490],
                    [new Date(2009,0,1),50350],[new Date(2010,0,1),54950],[new Date(2011,0,1),59050],
                    [new Date(2012,0,1),59370],[new Date(2013,0,1),48980],]
          },
        ]
      },
    ];

    this.timeExtent = [new Date(2000,0,1), new Date(2013,0,1)];
    this.valueExtent = [103600, 0];

    this.datasetTypes = this.datasetComputers[0].data.map(x => ({
      name: x.name,
      filter: x.filter,
      data: [],
    }));

    this.datasetTypes.forEach((type, index) => {
      this.datasetComputers.forEach(com => {
        type.data.push({
          name: com.name,
          value: com.data[index].value,
        });
      });
    });

    this.lineChartType = 'Computer';
  });
