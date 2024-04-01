import React from 'react';
import styles from './CardComponent.module.css'; // Updated import for CSS module
import dev from "../../src/Media/development.png";
import uiux from "../../src/Media/uiux.png";
import mang from "../../src/Media/management.png";

const CardComponent = () => {
  const cards = [
    { title: "Development", imgSrc: dev }, // Use the imported image variable directly
    { title: "UI/UX Design", imgSrc: uiux }, // Use the imported image variable directly
    { title: "Management", imgSrc: mang }, // Use the imported image variable directly
  ];

  return (
    <div className={styles.cardsContainer} style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
      {cards.map((card, index) => (
        <div className={styles.cards} key={index}>
          <figure className={styles.card}>
            <img src={card.imgSrc} alt={card.title} className={styles.cardImage} />
            <figcaption className={styles.cardTitle}>{card.title}</figcaption>
          </figure>
        </div>
      ))}
    </div>
  );
};

export default CardComponent;