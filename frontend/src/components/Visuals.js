import React, { useMemo, useState } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts';

function Visuals({ signals, accounts = [] }) {
    // UI Filter States
    const [lineTimeframeFilter, setLineTimeframeFilter] = useState('daily');
    // 1. Process signals for Pie Chart (Distribution by Type)
    const pieData = useMemo(() => {
        const typeCounts = {};

        signals.forEach(signal => {
            const type = signal.type || 'unknown';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        return Object.keys(typeCounts).map(type => ({
            name: type,
            value: typeCounts[type]
        }));
    }, [signals]);

    // Format labels for Pie Chart to display percentages
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // 2. Process signals for Bar Chart (Signals per Account)
    const barData = useMemo(() => {
        const accountCounts = {};

        // Create dictionary of account.id -> account.name for quick lookup
        const accountMap = {};
        accounts.forEach(acc => {
            accountMap[acc.id] = acc.name;
        });

        signals.forEach(signal => {
            const accId = signal.account_id;
            const accountName = accountMap[accId] || `Account #${accId}`;
            accountCounts[accountName] = (accountCounts[accountName] || 0) + 1;
        });

        // Convert into array format expected by recharts and sort by highest signals
        const formattedData = Object.keys(accountCounts).map(name => ({
            account_name: name,
            signal_count: accountCounts[name]
        }));

        return formattedData.sort((a, b) => b.signal_count - a.signal_count);
    }, [signals, accounts]);

    // 3. Process signals for Line Chart (Signal activity over time)
    const lineData = useMemo(() => {
        const dateCounts = {};

        // Helper to format Date by Timeframe
        const formatTimeframe = (dateString, timeframe) => {
            const d = new Date(dateString);

            if (timeframe === 'hourly') {
                return `${d.toISOString().substring(0, 10)} ${d.toISOString().substring(11, 13)}:00`;
            } else if (timeframe === 'weekly') {
                // Approximate weekly grouping by starting on Monday of that week
                const day = d.getUTCDay();
                const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(d.setUTCDate(diff));
                return monday.toISOString().substring(0, 10) + ' (Week)';
            }

            // Default Daily
            return dateString.substring(0, 10);
        };

        signals.forEach(signal => {
            if (signal.created_at) {
                const formattedDate = formatTimeframe(signal.created_at, lineTimeframeFilter);
                dateCounts[formattedDate] = (dateCounts[formattedDate] || 0) + 1;
            }
        });

        // Convert into array format expected by recharts and sort chronologically
        const formattedData = Object.keys(dateCounts).map(dateStr => ({
            date: dateStr,
            signal_count: dateCounts[dateStr]
        }));

        return formattedData.sort((a, b) => new Date(a.date.substring(0, 10)) - new Date(b.date.substring(0, 10)));
    }, [signals, lineTimeframeFilter]);

    // Color palette for charts
    const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#64748b'];

    // Shared Tooltip Styling
    const tooltipStyle = { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

    if (signals.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 fade-up">
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <p>No signals found to display.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 fade-up">
            {/* Top Row: Pie Chart & Bar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Pie Chart Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Type Distribution</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip formatter={(value, name) => [value, name]} contentStyle={tooltipStyle} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Signals per Account</h2>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="account_name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: '#F1F5F9' }} />
                                <Bar dataKey="signal_count" name="Signals" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Bottom Row: Line Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Activity Over Time</h2>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        {['hourly', 'daily', 'weekly'].map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setLineTimeframeFilter(tf)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${lineTimeframeFilter === tf
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <RechartsTooltip contentStyle={tooltipStyle} />
                            <Line
                                type="monotone"
                                dataKey="signal_count"
                                name="Signals"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}

export default Visuals;
