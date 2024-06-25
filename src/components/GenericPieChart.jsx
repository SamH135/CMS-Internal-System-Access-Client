import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

const GenericPieChart = ({ data, title }) => {
    const generateColors = (numColors) => {
        const hueStep = 360 / numColors;
        return Array.from({ length: numColors }, (_, i) => {
            const hue = i * hueStep;
            return `hsl(${hue}, 70%, 60%)`;
        });
    };

    const sortedData = Object.entries(data)
        .filter(([_, value]) => parseFloat(value) > 0)  // Exclude 0 value items
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    const total = Object.values(sortedData).reduce((sum, value) => sum + parseFloat(value), 0);

    const chartData = Object.entries(sortedData).map(([label, value]) => {
        const numericValue = parseFloat(value);
        return {
            title: label,
            value: numericValue,
            percentage: (numericValue / total) * 100
        };
    });

    const colors = generateColors(chartData.length);
    chartData.forEach((entry, index) => {
        entry.color = colors[index];
    });

    const cardStyle = {
        backgroundColor: '#4a4a4a',
        padding: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
    };

    const scrollbarStyle = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #2b2b2b;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #555;
        }
    `;

    return (
        <div className="generic-pie-chart" style={cardStyle}>
            <style>{scrollbarStyle}</style>
            <h3 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '20px' }}>{title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '60%', position: 'relative' }}>
                    <PieChart
                        data={chartData}
                        radius={42}
                        lineWidth={40}
                        segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                        animate
                        label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                        labelStyle={{
                            fill: '#ffffff',
                            fontSize: '5px',
                            fontWeight: 'bold',
                            textShadow: '0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black',
                        }}
                        labelPosition={75}
                    />
                </div>
                <div className="custom-scrollbar" style={{ width: '35%', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                    {chartData.map((entry) => (
                        <div key={entry.title} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: entry.color, marginRight: '10px', flexShrink: 0 }}></div>
                            <div style={{ flexGrow: 1 }}>
                                <div style={{ color: '#ffffff', fontSize: '14px' }}>{entry.title}</div>
                                <div style={{ color: '#cccccc', fontSize: '12px' }}>
                                    {entry.value.toFixed(1)}lb ({entry.percentage.toFixed(1)}%)
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GenericPieChart;