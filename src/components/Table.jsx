import React, { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import '../App.css'

function Table() {
    const [classes, setClasses] = useState(['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5']);
    const [times, setTimes] = useState(['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM']);

    
    const getDefaultTimetable = () => {
        const defaultTimetable = {};
        classes.forEach(cls => {
            const row = { Class: cls };
            times.forEach(time => {
                row[time] = '';
            });
            defaultTimetable[cls] = row;
        });
        return defaultTimetable;
    };
    const [timetable, setTimetable] = useState(() => {
        const storedTimetable = localStorage.getItem('timetable');
        return storedTimetable ? JSON.parse(storedTimetable) : getDefaultTimetable();
    });
    useEffect(() => {
        localStorage.setItem('timetable', JSON.stringify(timetable));
    }, [timetable]);

    const handleClassNameChange = (e, cls) => {
        const updatedClasses = [...classes];
        updatedClasses[classes.indexOf(cls)] = e.target.value;
        setClasses(updatedClasses);
    };

    const handleTimeChange = (e, index) => {
        const updatedTimes = [...times];
        updatedTimes[index] = e.target.value;
        setTimes(updatedTimes);
    };

    const handleSubjectChange = (e, cls, time) => {
        const updatedTimetable = { ...timetable };
        updatedTimetable[cls][time] = e.target.value;
        setTimetable(updatedTimetable);
        console.log(timetable)
    };

    const addColumn = () => {
        const newTime = prompt('Enter the time for the new time:');
        if (newTime) {
            setTimes([...times, newTime]);
        }
        const table = document.getElementById('timetable');
        const currentWidth = table.offsetWidth;
        const newWidth = currentWidth + 100;
        table.style.width = newWidth + 'px';
    };

    const addRow = () => {
        const newClass = prompt('Enter the name for the new class:');
        if (newClass) {
            const newRow = { Class: newClass };
            times.forEach(time => {
                newRow[time] = '';
            });
            setClasses([...classes, newClass]);
            setTimetable({ ...timetable, [newClass]: newRow });
        }
    };

    const deleteColumn = (index) => {
        const updatedTimes = [...times];
        updatedTimes.splice(index, 1);
        setTimes(updatedTimes);
        const table = document.getElementById('timetable');
        const currentWidth = table.offsetWidth;
        const newWidth = currentWidth - 100;
        table.style.width = newWidth + 'px';
    };

    const deleteRow = (index) => {
        const updatedClasses = [...classes];
        const deletedClass = updatedClasses.splice(index, 1)[0];
        const updatedTimetable = { ...timetable };
        delete updatedTimetable[deletedClass];
        setClasses(updatedClasses);
        setTimetable(updatedTimetable);
    };

    const downloadImage = () => {
        const table = document.getElementById('timetable');
        toPng(table)
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = 'timetable.png';
                link.href = dataUrl;
                link.click();
            });
    };

    return (
        <div className='table'>
            <table id='timetable'>
                <thead>
                    <tr>
                        <th></th>
                        {times.map((time, index) => (
                            <th key={index}>
                                <input className='time'
                                    type="text"
                                    value={time}
                                    onChange={(e) => handleTimeChange(e, index)}
                                />
                                <button className='delete' onClick={() => deleteColumn(index)}>X</button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {classes.map((cls, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>
                                <input
                                    type="text" className='time'
                                    value={cls}
                                    onChange={(e) => handleClassNameChange(e, cls)}
                                />
                                <button className='delete' onClick={() => deleteRow(rowIndex)}>X</button>
                            </td>
                            {times.map((time, colIndex) => (
                                <td key={colIndex}>
                                    <input
                                        type="text" className='class'
                                        value={timetable[cls][time]}
                                        onChange={(e) => handleSubjectChange(e, cls, time)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="edits">
                <button onClick={addColumn}>Add Time</button>
                <button onClick={addRow}>Add Class</button>
                <button onClick={downloadImage}>Download Table as Image</button>
            </div>
        </div>
    );
}

export default Table;
