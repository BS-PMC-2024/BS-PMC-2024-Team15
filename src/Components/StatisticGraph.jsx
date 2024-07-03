import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 

class GraphComponent extends Component {
    constructor() {
        super();
        this.addSymbols = this.addSymbols.bind(this);
    }
    
    addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);
        
        if (order > suffixes.length - 1)
            order = suffixes.length - 1;

        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;    
    }
    
    render() {    
        const options = {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "Studying time per day for the next 30 days"
            },
            axisY: {
                title: "Hours",
                labelFormatter: this.addSymbols,
                scaleBreaks: {
                    autoCalculate: true
                }
            },
            axisX: {
                title: "Days",
                labelAngle: 0
            },
            data: [{
                type: "column",
                dataPoints: [
                    { label: "Sunday", y: 6 },// extract data from user events to adjust avarage learning time per day for next 30 days
                    { label: "Monday", y:  4 },
                    { label: "Tuesday", y: 8 },
                    { label: "Wednesday", y:  14 },
                    { label: "Thursday", y:  2 },
                    { label: "Friday", y:  0 },
                    { label: "Saturday", y: 8 }  
                ]
            }]
        }
                            
        return (
            <div id="statistic">
                <CanvasJSChart options={options} />
            </div>
        );
    }            
}

export default GraphComponent;
