import React from 'react';
export default function Settings({onClose}) {
  return (
    <div className=''>
      <h2>content of setting</h2>
      <button onClick={onClose}>Close</button>
    </div>
  )
}