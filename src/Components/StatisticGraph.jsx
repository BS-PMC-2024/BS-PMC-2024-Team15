import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class GraphComponent extends Component {
    constructor() {
        super();
        this.state = {
            eventStatistics: []
        };
        this.addSymbols = this.addSymbols.bind(this);
    }

    componentDidMount() {
        this.fetchEventStatistics();
    }

    fetchEventStatistics = async () => {
        try {
            const idToken = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:5000/get_events', {
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const events = await response.json();

            // Filter events within the next 14 days
            const today = new Date();
            const next14Days = new Date();
            next14Days.setDate(today.getDate() + 14);

            const filteredEvents = events.filter(event => {
                const eventDate = new Date(event.startTime);
                return eventDate >= today && eventDate <= next14Days;
            });

            const eventStatistics = this.calculateEventStatistics(filteredEvents);
            this.setState({ eventStatistics });
        } catch (error) {
            console.error('Error fetching events:', error);
            // Handle error (e.g., show error message)
        }
    };

    calculateEventStatistics = (events) => {
        const eventTypes = ['Study', 'Hobby', 'Social']; // Update with your event types
        const statistics = {};

        // Initialize statistics object
        eventTypes.forEach(type => {
            statistics[type] = 0;
        });

        // Calculate total duration for each event type
        events.forEach(event => {
            if (eventTypes.includes(event.eventType)) {
                // Assuming duration is a string like '1:00' or '0:30'
                const [hours, minutes] = event.duration.split(':').map(Number);
                const durationInHours = hours + minutes / 60;
                statistics[event.eventType] += durationInHours;
            }
        });

        return eventTypes.map(type => ({
            label: type,
            y: statistics[type]
        }));
    };

    addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);

        if (order > suffixes.length - 1)
            order = suffixes.length - 1;

        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }

    render() {
        const { eventStatistics } = this.state;

        const options = {
            animationEnabled: true,
            theme: "light2", //light2,dark1,dark2
            title: {
                text: "Time management for next 14 days"
            },
            axisY: {
                title: "Hours",
                labelFormatter: this.addSymbols,
                scaleBreaks: {
                    autoCalculate: true
                }
            },
            axisX: {
                title: "Events",
                labelAngle: 0
            },
            data: [{
                type: "column",
                dataPoints: eventStatistics // Use the calculated event statistics here
            }]
        };

        return (
            <div id="statistic">
                <CanvasJSChart options={options} />
            </div>
        );
    }
}

export default GraphComponent;
