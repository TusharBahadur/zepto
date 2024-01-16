import React, { useEffect, useRef, useState } from 'react';
import styles from './select.module.css';

const New = () => {
  const multiple = true;
  const options = [
    { label: 'Jane Doe', value: 1 },
    { label: 'John Doe', value: 2 },
    { label: 'Tushar Bahadur', value: 3 },
    { label: 'Zepto is better than Swiggy', value: 4},
    { label: 'React', value: 5 },
    { label: 'HTML', value: 6 },
    { label: 'Second', value: 7 },
    { label: 'Third', value: 8 },
    { label: 'Fourth', value: 9 },
   
  ];

  
  const handleInputKeyDown = (e) => {
 
    if ((e.key === 'Enter'  && filteredOptions.length > 0)) {
     
      handleOptionClick(filteredOptions[0]);
      setSearchQuery(''); 
    }
  };
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isBackspacePressed, setIsBackspacePressed] = useState(false);

  const containerRef = useRef(null);

  const isSelectedOption = (option) => {
    return  selectedValue.some((v) => v.value === option.value);
  };
  

  const handleOptionClick = (option) => {
    if (selectedValue.includes(option)) {
      setSelectedValue(selectedValue.filter((o) => o !== option));
    } else {
      setSelectedValue([...selectedValue, option]);
    }
  };

  const clearOption = (e) => {
    e.stopPropagation();
    setSelectedValue([]);
  };

  const handleBackspace = (e) => {
    if (e.code === 'Backspace' && !isOpen) {
      e.preventDefault();

    
      if (!isBackspacePressed && selectedValue.length > 0) {
        const lastSelectedItem = document.querySelector(`.${styles['option-badge']}:last-child`);
        if (lastSelectedItem) {
            lastSelectedItem.style.backgroundColor = '#777';
          }
        
        setIsBackspacePressed(true);

      } else if (isBackspacePressed && selectedValue.length > 0) {
       
        setSelectedValue(selectedValue.slice(0, -1));
        setIsBackspacePressed(false);
      }
    }
  };

  useEffect(()=>{
    if(isOpen) setHighlightedIndex(0)

  },[])

 
useEffect(() => {
    const handler = (e) => {
      if (e.target != containerRef.current) return
      switch (e.code) {
        case 'Backspace':
            handleBackspace(e);
            break;
        case "Enter":
        case "Space":
          setIsOpen(prev => !prev)
          if (isOpen){ 
            handleOptionClick(options[highlightedIndex])
          
          break
          }
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true)
            break
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue)
          }
          break
        }
        case "Escape":
          setIsOpen(false)
          break
      }
    }
    containerRef.current?.addEventListener("keydown", handler)

    return () => {
      containerRef.current?.removeEventListener("keydown", handler)
    }
  }, [isOpen, highlightedIndex, options])

  return (
    <>
    <h1 className={styles.title}>Pick a User</h1>
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}><input
        type="text"
        className={styles.input}
        value={searchQuery}
        onKeyDown={handleInputKeyDown}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
        {selectedValue.map((v, index) => (
          <button
            key={v.value}
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick(v);
            }}
            className={`${styles['option-badge']} ${
              index === highlightedIndex && isBackspacePressed ? styles.highlighted : ''
            }`}
          >
            {v.label}
            <span className={styles['remove-btn']}>&times;</span>
          </button>
        ))}
      </span>
      <button className={styles['clear-btn']} onClick={clearOption}>
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      
      <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
        {filteredOptions
          .filter((option) => !isSelectedOption(option))
          .map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`${styles.option} ${isSelectedOption(option) ? styles.selected : ''} ${
                index === highlightedIndex ? styles.highlighted : ''
              }`}
            >
              {option.label}
            </li>
          ))}
      </ul>
    </div>
    </>
  );
};

export default New;
