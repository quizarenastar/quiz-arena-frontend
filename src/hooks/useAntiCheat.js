import { useState, useEffect, useRef } from 'react';
import QuizService from '../service/QuizService';

const useAntiCheat = (quizId, attemptId, settings = {}) => {
    const [violations, setViolations] = useState([]);
    const [isWindowFocused, setIsWindowFocused] = useState(true);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [timeSpentOutside, setTimeSpentOutside] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const lastFocusTime = useRef(Date.now());
    const startTime = useRef(Date.now());
    const violationTimeout = useRef(null);

    const {
        detectTabSwitch = false,
        detectCopyPaste = false,
        forceFullscreen = false,
        maxTabSwitches = 3,
        autoSubmitOnViolation = false,
        warningThreshold = 2,
    } = settings;

    // Report violation to backend
    const reportViolation = async (violationType, details = {}) => {
        try {
            await QuizService.reportViolation(attemptId, {
                type: violationType,
                timestamp: new Date().toISOString(),
                details,
            });
        } catch (error) {
            console.error('Failed to report violation:', error);
        }
    };

    // Handle window focus/blur events
    useEffect(() => {
        if (!detectTabSwitch) return;

        const handleFocus = () => {
            const now = Date.now();
            const timeOut = now - lastFocusTime.current;

            if (!isWindowFocused && timeOut > 2000) {
                // Only count if away for more than 2 seconds
                setTimeSpentOutside((prev) => prev + timeOut);
                setTabSwitchCount((prev) => {
                    const newCount = prev + 1;

                    // Report violation
                    reportViolation('tab_switch', {
                        switchCount: newCount,
                        timeSpentOutside: timeOut,
                        totalTimeOutside: timeSpentOutside + timeOut,
                    });

                    return newCount;
                });

                const newViolation = {
                    id: Date.now(),
                    type: 'tab_switch',
                    message: `Tab switch detected (${
                        tabSwitchCount + 1
                    }/${maxTabSwitches})`,
                    timestamp: new Date(),
                    severity:
                        tabSwitchCount + 1 >= maxTabSwitches
                            ? 'critical'
                            : 'warning',
                };

                setViolations((prev) => [...prev, newViolation]);
            }

            setIsWindowFocused(true);
            lastFocusTime.current = now;
        };

        const handleBlur = () => {
            setIsWindowFocused(false);
            lastFocusTime.current = Date.now();
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                handleBlur();
            } else {
                handleFocus();
            }
        });

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('visibilitychange', () => {});
        };
    }, [
        detectTabSwitch,
        isWindowFocused,
        tabSwitchCount,
        timeSpentOutside,
        maxTabSwitches,
        attemptId,
    ]);

    // Handle copy/paste detection
    useEffect(() => {
        if (!detectCopyPaste) return;

        const handleCopy = (e) => {
            e.preventDefault();
            const violation = {
                id: Date.now(),
                type: 'copy_attempt',
                message: 'Copy attempt detected and blocked',
                timestamp: new Date(),
                severity: 'warning',
            };

            setViolations((prev) => [...prev, violation]);
            reportViolation('copy_paste', { action: 'copy' });
        };

        const handlePaste = (e) => {
            e.preventDefault();
            const violation = {
                id: Date.now(),
                type: 'paste_attempt',
                message: 'Paste attempt detected and blocked',
                timestamp: new Date(),
                severity: 'warning',
            };

            setViolations((prev) => [...prev, violation]);
            reportViolation('copy_paste', { action: 'paste' });
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            const violation = {
                id: Date.now(),
                type: 'right_click',
                message: 'Right-click disabled during quiz',
                timestamp: new Date(),
                severity: 'info',
            };

            setViolations((prev) => [...prev, violation]);
        };

        const handleKeyDown = (e) => {
            // Disable common shortcuts
            if (
                (e.ctrlKey &&
                    ['c', 'v', 'x', 'a', 's', 'p', 'f'].includes(
                        e.key.toLowerCase()
                    )) ||
                (e.altKey && e.key === 'Tab') ||
                e.key === 'F12' ||
                (e.ctrlKey &&
                    e.shiftKey &&
                    ['i', 'j', 'c'].includes(e.key.toLowerCase()))
            ) {
                e.preventDefault();
                const violation = {
                    id: Date.now(),
                    type: 'keyboard_shortcut',
                    message: `Keyboard shortcut blocked: ${e.key}`,
                    timestamp: new Date(),
                    severity: 'warning',
                };

                setViolations((prev) => [...prev, violation]);
                reportViolation('keyboard_shortcut', {
                    key: e.key,
                    ctrlKey: e.ctrlKey,
                    altKey: e.altKey,
                    shiftKey: e.shiftKey,
                });
            }
        };

        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [detectCopyPaste, attemptId]);

    // Handle fullscreen
    useEffect(() => {
        if (!forceFullscreen) return;

        const enterFullscreen = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        };

        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!document.fullscreenElement;
            setIsFullscreen(isCurrentlyFullscreen);

            if (!isCurrentlyFullscreen && forceFullscreen) {
                const violation = {
                    id: Date.now(),
                    type: 'fullscreen_exit',
                    message: 'Exited fullscreen mode',
                    timestamp: new Date(),
                    severity: 'warning',
                };

                setViolations((prev) => [...prev, violation]);
                reportViolation('fullscreen_exit', {});

                // Give user 5 seconds to return to fullscreen
                violationTimeout.current = setTimeout(() => {
                    if (!document.fullscreenElement) {
                        const criticalViolation = {
                            id: Date.now(),
                            type: 'fullscreen_violation',
                            message: 'Failed to return to fullscreen mode',
                            timestamp: new Date(),
                            severity: 'critical',
                        };

                        setViolations((prev) => [...prev, criticalViolation]);
                        reportViolation('fullscreen_violation', {});
                    }
                }, 5000);
            } else if (violationTimeout.current) {
                clearTimeout(violationTimeout.current);
                violationTimeout.current = null;
            }
        };

        enterFullscreen();
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            );
            if (violationTimeout.current) {
                clearTimeout(violationTimeout.current);
            }
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }, [forceFullscreen, attemptId]);

    // Auto-submit on critical violations
    useEffect(() => {
        if (!autoSubmitOnViolation) return;

        const criticalViolations = violations.filter(
            (v) => v.severity === 'critical'
        ).length;
        const totalViolations = violations.length;

        if (criticalViolations > 0 || totalViolations >= warningThreshold) {
            // You can trigger auto-submit here
            console.warn(
                'Critical violations detected, consider auto-submitting quiz'
            );
        }
    }, [violations, autoSubmitOnViolation, warningThreshold]);

    // Clear old violations (keep only last 50)
    useEffect(() => {
        if (violations.length > 50) {
            setViolations((prev) => prev.slice(-50));
        }
    }, [violations]);

    const clearViolations = () => {
        setViolations([]);
    };

    const getViolationStats = () => {
        const stats = violations.reduce((acc, violation) => {
            acc[violation.severity] = (acc[violation.severity] || 0) + 1;
            return acc;
        }, {});

        return {
            total: violations.length,
            critical: stats.critical || 0,
            warning: stats.warning || 0,
            info: stats.info || 0,
            tabSwitches: tabSwitchCount,
            timeSpentOutside: Math.round(timeSpentOutside / 1000), // in seconds
        };
    };

    return {
        violations,
        violationStats: getViolationStats(),
        isWindowFocused,
        tabSwitchCount,
        timeSpentOutside: Math.round(timeSpentOutside / 1000),
        isFullscreen,
        clearViolations,
        canContinue: tabSwitchCount < maxTabSwitches,
    };
};

export default useAntiCheat;
