import React, { useState, useEffect } from 'react';
import '../styles/readiness.css';

const ReadinessIndex = () => {
    const [readinessData, setReadinessData] = useState(null);
    const [detailedMetrics, setDetailedMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchReadinessData();
        fetchDetailedMetrics();
    }, []);

    const fetchReadinessData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/readiness/score', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setReadinessData(data.data);
            }
        } catch (error) {
            console.error('Error fetching readiness data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetailedMetrics = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/readiness/metrics', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDetailedMetrics(data.data);
            }
        } catch (error) {
            console.error('Error fetching detailed metrics:', error);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 0.8) return '#10b981'; // Green
        if (score >= 0.6) return '#f59e0b'; // Yellow
        if (score >= 0.4) return '#f97316'; // Orange
        return '#ef4444'; // Red
    };

    const getScoreLabel = (score) => {
        if (score >= 0.8) return 'Excellent';
        if (score >= 0.6) return 'Good';
        if (score >= 0.4) return 'Fair';
        return 'Needs Improvement';
    };

    if (loading) {
        return (
            <div className="readiness-container">
                <div className="loading">Calculating your readiness index...</div>
            </div>
        );
    }

    return (
        <div className="readiness-container">
            <div className="readiness-header">
                <h2>Learning Readiness Index</h2>
                <p>Your personalized learning progress assessment</p>
            </div>

            {readinessData && (
                <div className="readiness-score-card">
                    <div className="score-circle" style={{ borderColor: getScoreColor(readinessData.readinessScore) }}>
                        <div className="score-number" style={{ color: getScoreColor(readinessData.readinessScore) }}>
                            {readinessData.completionPercentage}%
                        </div>
                        <div className="score-label">
                            {getScoreLabel(readinessData.readinessScore)}
                        </div>
                    </div>

                    <div className="score-details">
                        <div className="detail-item">
                            <span className="detail-label">Enrolled Courses</span>
                            <span className="detail-value">{readinessData.enrolledCourses}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Score Source</span>
                            <span className="detail-value">{readinessData.source === 'llm' ? 'AI Analysis' : 'Basic Calculation'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Raw Score</span>
                            <span className="detail-value">{readinessData.readinessScore.toFixed(3)}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="metrics-overview">
                <h3>Learning Metrics</h3>
                {readinessData && (
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-icon">📹</div>
                            <div className="metric-content">
                                <h4>Videos Watched</h4>
                                <p>{readinessData.metrics.VideosWatched} / {readinessData.metrics.TotalVideos}</p>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${(readinessData.metrics.VideosWatched / readinessData.metrics.TotalVideos) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon">📝</div>
                            <div className="metric-content">
                                <h4>Notes Completed</h4>
                                <p>{readinessData.metrics.NotesCompleted} / {readinessData.metrics.TotalNotes}</p>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${(readinessData.metrics.NotesCompleted / readinessData.metrics.TotalNotes) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-icon">📋</div>
                            <div className="metric-content">
                                <h4>Assignments Done</h4>
                                <p>{readinessData.metrics.AssignmentsDone} / {readinessData.metrics.TotalAssignments}</p>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${(readinessData.metrics.AssignmentsDone / readinessData.metrics.TotalAssignments) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="actions-section">
                <button 
                    className="toggle-details-btn"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Hide Details' : 'Show Course Details'}
                </button>
                <button 
                    className="refresh-btn"
                    onClick={() => {
                        setLoading(true);
                        fetchReadinessData();
                        fetchDetailedMetrics();
                    }}
                >
                    Refresh Index
                </button>
            </div>

            {showDetails && detailedMetrics && (
                <div className="detailed-metrics">
                    <h3>Course-wise Progress</h3>
                    {detailedMetrics.courseMetrics.length === 0 ? (
                        <p className="no-courses">No courses enrolled yet. Enroll in courses to track your progress!</p>
                    ) : (
                        <div className="course-metrics-grid">
                            {detailedMetrics.courseMetrics.map((course, index) => (
                                <div key={index} className="course-metric-card">
                                    <h4>{course.courseName}</h4>
                                    <div className="course-progress">
                                        <div className="course-progress-bar">
                                            <div 
                                                className="course-progress-fill" 
                                                style={{ width: `${course.overallProgress}%` }}
                                            ></div>
                                        </div>
                                        <span className="course-progress-text">{course.overallProgress}%</span>
                                    </div>
                                    <div className="course-stats">
                                        <span>Videos: {course.videosWatched}/{course.totalVideos}</span>
                                        <span>Notes: {course.notesCompleted}/{course.totalNotes}</span>
                                        <span>Assignments: {course.assignmentsDone}/{course.totalAssignments}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReadinessIndex;
