import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './CardComponent.module.css'; // Ensure the path is correct
import dev from "../../Media/development.png"; // Verify image paths
import uiux from "../../Media/uiux.png";
import mang from "../../Media/management.png";

const CardComponent = () => {
  const cards = [
    { title: "Web & Mobile Development", imgSrc: dev, category: "Web & Mobile Development" },
    { title: "Business Intelligence", imgSrc: uiux, category: "Business Intelligence" },
    { title: "Digital Marketing", imgSrc: mang, category: "Digital Marketing & Design" },
  ];

  return (
    <div className={styles.cardsContainer}>
      {cards.map((card, index) => (
        <Link to={`/jobs/${encodeURIComponent(card.category)}`} key={index} className={styles.cardLink}>
          <div className={styles.card}>
            <img src={card.imgSrc} alt={card.title} className={styles.cardImage} />
            <figcaption className={styles.cardTitle}>{card.title}</figcaption>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CardComponent;
