import React from 'react';
import styles from './VariantSelector.module.css';

const VariantSelector = ({ variants, selectedOptions, onOptionSelect }) => {
  return (
    <div className={styles.container}>
      {variants.map((variantGroup) => (
        <div key={variantGroup.name} className={styles.group}>
          <h4 className={styles.groupName}>{variantGroup.name}</h4>
          <div className={styles.options}>
            {variantGroup.options.map((option) => {
              const isSelected = selectedOptions[variantGroup.name] === option;
              return (
                <button
                  key={option}
                  onClick={() => onOptionSelect(variantGroup.name, option)}
                  className={`${styles.optionBtn} ${isSelected ? styles.selected : ''}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;
