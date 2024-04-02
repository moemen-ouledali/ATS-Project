import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './CardComponent.module.css';
import dev from "../../src/Media/development.png";
import uiux from "../../src/Media/uiux.png";
import mang from "../../src/Media/management.png";

const CardComponent = () => {
  const cards = [
    { title: "Web & Mobile Development", imgSrc: dev, category: "Web & Mobile Development" },
    { title: "Business Intelligence", imgSrc: uiux, category: "Business Intelligence" },
    { title: "Digital Marketing & Design", imgSrc: mang, category: "Digital Marketing & Design" },
  ];

  return (
    <div className={styles.cardsContainer}>
      {cards.map((card, index) => (
        <Link to={`/jobs/${encodeURIComponent(card.category)}`} key={index} className={styles.cardLink}> {/* Use Link to navigate */}
          <div className={styles.cards}>
            <figure className={styles.card}>
              <img src={card.imgSrc} alt={card.title} className={styles.cardImage} />
              <figcaption className={styles.cardTitle}>{card.title}</figcaption>
            </figure>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CardComponent;
