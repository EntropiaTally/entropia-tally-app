import React, { useState, useEffect } from 'react';

const NotesView = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    function updateValues(newData) {
      if (newData.notes) {
        setValue(newData.notes);
      }
    }

    window.api.get('active-session').then(updateValues);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.api.set('session-notes', value);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="content box">
      <textarea
        className="textarea"
        defaultValue={value}
        rows={10}
        placeholder="Enter your notes here"
        onChange={evt => setValue(evt.target.value)}
      />
    </div>
  );
};

export default NotesView;
