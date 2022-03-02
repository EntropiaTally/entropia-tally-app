import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Modal from '@components/modal';

const HuntingSetModal = ({ set, isOpen, setShortcut, closeModal }) => {
  const [shortcutValue, setShortcutValue] = useState(set?.shortcut ?? '');

  const save = () => {
    setShortcut(shortcutValue);
    closeModal();
  };

  return (
    <Modal
      type="card"
      title={`Shortcut: ${set.name}`}
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <p>Write the keyboard shortcut you want for this weapon set</p>
      <p><a onClick={() => window.api.call('goto-shortcut-guide')}>Examples & available keys</a></p>
      <div className="control">
        <div className="block">
          <input type="text" defaultValue={set.shortcut} className="input" onChange={event => setShortcutValue(event.target.value)} />
        </div>
        <button type="button" className="button is-info" onClick={save}>Save</button>
      </div>
    </Modal>
  );
};

HuntingSetModal.propTypes = {
  set: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    decay: PropTypes.string,
    shortcut: PropTypes.string,
    default: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  }),
  isOpen: PropTypes.bool,
  setShortcut: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

HuntingSetModal.defaultProps = {
  set: {},
  isOpen: false,
};

const HuntingSet = ({ set, saveSet, hasDefault }) => {
  const { id, name, decay, shortcut } = set;
  const [values, setValues] = useState({});
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

  useEffect(() => {
    setValues({ id, name, decay, shortcut });
  }, [id, name, decay, shortcut, setValues]);

  const valueChanged = useCallback(event => {
    const value = event.target.value;
    let newName = values?.name ?? name;
    let newDecay = values?.decay ?? decay;

    if (event.target.classList.contains('set-name') && name !== value) {
      newName = value;
    } else if (decay !== value) {
      newDecay = value;
    }

    setValues({ id, name: newName, decay: newDecay, shortcut });
  }, [values, id, name, decay, shortcut]);

  const setShortcut = useCallback(shortcut => {
    if (values.id) {
      const newValues = { ...values, shortcut };
      setValues(newValues);
      saveSet('save', newValues);
    }
  }, [values, saveSet]);

  const doAction = action => {
    const newValues = values.decay ? values : { id, name, decay, shortcut };
    saveSet(action, newValues);
  };

  return (
    <>
      <div className="is-flex">
        <div className="column">
          <input
            type="text"
            className="input is-small set-name"
            placeholder="Name"
            defaultValue={name}
            onChange={valueChanged}
          />
        </div>
        <div className="column">
          <div className="control has-icons-right">
            <input
              type="number"
              className="input is-small set-decay"
              placeholder="Weapon decay"
              defaultValue={decay}
              onChange={valueChanged}
            />
            <span className="icon is-medium is-right">PEC</span>
          </div>
        </div>
        <div className="column column-325">
          <div className="buttons">
            {id && (
              <button type="button" className="button is-small is-link" onClick={() => setIsShortcutModalOpen(true)}>
                Shortcut
              </button>
            )}
            <button type="button" className="button is-small is-info" onClick={() => doAction('save')}>
              { id ? 'Save' : 'Add' }
            </button>
            {id && <button type="button" className="button is-small is-danger" onClick={() => doAction('delete')}>Delete</button>}
            {(id && hasDefault) && (
              <button type="button" className={`button is-small ${set.default ? 'is-success' : 'is-warning'}`} onClick={() => doAction('set-default')}>
                { set.default ? 'Default' : 'Set default' }
              </button>
            )}
          </div>
        </div>
      </div>
      {set.id && isShortcutModalOpen && (
        <HuntingSetModal
          set={set}
          isOpen={isShortcutModalOpen}
          setShortcut={setShortcut}
          closeModal={() => setIsShortcutModalOpen(false)}
        />
      )}
    </>
  );
};

HuntingSet.propTypes = {
  set: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    decay: PropTypes.string,
    shortcut: PropTypes.string,
    default: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  }),
  saveSet: PropTypes.func.isRequired,
  hasDefault: PropTypes.bool,
};

HuntingSet.defaultProps = {
  set: {},
  hasDefault: true,
};

const HuntingSets = ({ huntingSets }) => {
  const [showNew, setShowNew] = useState(true);

  const setHuntingSet = useCallback((action, savedSet) => {
    let allSets;

    if (action === 'delete') {
      allSets = huntingSets.filter(set => savedSet.id !== set.id);
    } else if (action === 'save' || action === 'set-default') {
      allSets = huntingSets.map(set => {
        const matchedSet = savedSet.id === set.id;
        const selectedSet = matchedSet ? savedSet : set;
        if (action === 'set-default') {
          selectedSet.default = Boolean(matchedSet);
        }

        return selectedSet;
      });
    }

    if (action !== 'delete' && !savedSet.id && savedSet.name && savedSet.decay) {
      allSets.push(savedSet);
    }

    if (action === 'save') {
      setShowNew(false);
    }

    window.api.set('hunting-sets', allSets).then(success => {
      if (success && action === 'save') {
        setShowNew(true);
      }
    });
  }, [huntingSets]);

  return (
    <div className="box block">
      <h3 className="title">Weapon sets</h3>
      <p className="help">
        Create sets to allow tracking of hunting returns.
        Go to the <a onClick={() => window.api.call('goto-wiki-weapontool')}>EntropiaWiki</a> to get the PEC cost of your weapon setup.
      </p>

      <div className="sets">
        {huntingSets && huntingSets.map(set => (
          <HuntingSet
            key={set?.id}
            set={set}
            saveSet={setHuntingSet}
            hasDefault={huntingSets.length > 1}
          />
        ))}
        {showNew && <HuntingSet saveSet={setHuntingSet} />}
      </div>
    </div>
  );
};

HuntingSets.propTypes = {
  huntingSets: PropTypes.array,
};

HuntingSets.defaultProps = {
  huntingSets: [],
};

export default HuntingSets;
