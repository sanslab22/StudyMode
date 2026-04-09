'use client';

import { useState } from 'react';
import './TimerModal.css';

const DEFAULTS = {
  POMODORO:   { studyMins: 25, sessions: 4, breakMins: 5,  breaks: 3 },
  'DEEP FOCUS': { studyMins: 90, sessions: 1, breakMins: 20, breaks: 1 },
  CUSTOM:     { studyMins: 30, sessions: 2, breakMins: 10, breaks: 1 },
};

const TYPES = ['POMODORO', 'DEEP FOCUS', 'CUSTOM'];

function TimerModal({ step, selectedType, onSelectType, onBack, onStart, onClose }) {
  const [config, setConfig] = useState(
    selectedType ? { ...DEFAULTS[selectedType] } : null
  );

  const handleSelectType = (type) => {
    setConfig({ ...DEFAULTS[type] });
    onSelectType(type);
  };

  const set = (field, value) => {
    const n = Math.max(1, parseInt(value) || 1);
    setConfig(prev => ({ ...prev, [field]: n }));
  };

  const handleStart = () => {
    onStart(config);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {step === 'select' && (
          <>
            <p className="modal-heading">Choose Timer Type</p>
            <div className="type-list">
              {TYPES.map(type => (
                <button
                  key={type}
                  className={`type-option ${selectedType === type ? 'type-option--active' : ''}`}
                  onClick={() => handleSelectType(type)}
                >
                  <span className="type-name">{type}</span>
                  <span className="type-plus">⊕</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'config' && config && (
          <>
            <p className="modal-heading">{selectedType}</p>
            <div className="config-grid">
              {(() => {
                const isCustom = selectedType === 'CUSTOM';
                return (
                  <>
                    <label className="config-label">Study Timer</label>
                    <div className="config-time">
                      <input
                        className={`config-input ${!isCustom ? 'config-input--readonly' : ''}`}
                        type="number"
                        min={1}
                        value={config.studyMins}
                        readOnly={!isCustom}
                        onChange={e => isCustom && set('studyMins', e.target.value)}
                      />
                      <span className="config-sep">:</span>
                      <span className="config-zeros">00</span>
                    </div>

                    <label className="config-label">Study Sessions</label>
                    <input
                      className={`config-input config-input--short ${!isCustom ? 'config-input--readonly' : ''}`}
                      type="number"
                      min={1}
                      value={config.sessions}
                      readOnly={!isCustom}
                      onChange={e => isCustom && set('sessions', e.target.value)}
                    />

                    <label className="config-label">Break Timer</label>
                    <div className="config-time">
                      <input
                        className={`config-input ${!isCustom ? 'config-input--readonly' : ''}`}
                        type="number"
                        min={1}
                        value={config.breakMins}
                        readOnly={!isCustom}
                        onChange={e => isCustom && set('breakMins', e.target.value)}
                      />
                      <span className="config-sep">:</span>
                      <span className="config-zeros">00</span>
                    </div>

                    <label className="config-label">Breaks</label>
                    <input
                      className={`config-input config-input--short ${!isCustom ? 'config-input--readonly' : ''}`}
                      type="number"
                      min={1}
                      value={config.breaks}
                      readOnly={!isCustom}
                      onChange={e => isCustom && set('breaks', e.target.value)}
                    />
                  </>
                );
              })()}
            </div>

            <div className="config-footer">
              <button className="back-btn" onClick={onBack}>← Back</button>
              <button className="start-btn" onClick={handleStart}>Start</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TimerModal;
