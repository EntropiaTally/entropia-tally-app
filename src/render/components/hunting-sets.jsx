import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const HuntingSet = ({ set, saveSet }) => {
  const { id, name, decay } = set;
  const [values, setValues] = useState({});

  const valueChanged = useCallback(event => {
    const value = event.target.value;
    let newName = values?.name ?? name;
    let newDecay = values?.decay ?? decay;

    if (event.target.classList.contains('set-name') && name !== value) {
      newName = value;
    } else if (decay !== value) {
      newDecay = value;
    }

    setValues({ id, name: newName, decay: newDecay });
  }, [values, id, name, decay]);

  const doAction = action => {
    const newValues = values.decay ? values : { id, name, decay };
    saveSet(action, newValues);
  };

  return (
    <div className="columns">
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
      <div className="column column-250">
        <div className="buttons">
          <button type="button" className="button is-small is-info" onClick={() => doAction('save')}>
            { id ? 'Save' : 'Add' }
          </button>
          {id && <button type="button" className="button is-small is-danger" onClick={() => doAction('delete')}>Delete</button>}
          {id && (
            <button type="button" className={`button is-small ${set.default ? 'is-success' : 'is-warning'}`} onClick={() => doAction('set-default')}>
              { set.default ? 'Default' : 'Set default' }
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

HuntingSet.propTypes = {
  set: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    decay: PropTypes.string,
    default: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  }),
  saveSet: PropTypes.func.isRequired,
};

HuntingSet.defaultProps = {
  set: {},
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
      <h3 className="title">Hunting sets</h3>
      <p className="help">
        Create sets allow tracking of hunting runs.
        Go to the <a onClick={() => window.api.call('goto-wiki-weapontool')}>EntropiaWiki</a> to get the PEC cost of your weapon setup.
      </p>

      <div className="sets">
        {huntingSets && huntingSets.map(set => (
          <HuntingSet
            key={set?.id}
            set={set}
            saveSet={setHuntingSet}
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
