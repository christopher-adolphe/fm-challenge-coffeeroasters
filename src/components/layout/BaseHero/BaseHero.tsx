import { IContent } from '../../../interfaces/content-interface';

import styles from './BaseHero.module.scss';

interface IBaseHeroProps {
  content: IContent;
}

const BaseHero = ({ content }: IBaseHeroProps) => {
  const { title, description, imagePath } = content;

  return (
    <section className={ styles['base-hero'] }>
      <div className="container">
        <div className={ styles['base-hero__content'] }>
          <picture>
            <source media="(min-width: 1110px)" srcSet={ imagePath ? imagePath[2] : '' } />
            <source media="(min-width: 768px)" srcSet={ imagePath ? imagePath[1] : '' } />
            <source srcSet={ imagePath ? imagePath[0] : '' } />
            <img
              src={ imagePath ? imagePath[0] : '' }
              alt={ title }
            />
          </picture>

          <div className={ styles['base-hero__body'] }>
            <h1>{ title }</h1>

            <p>{ description }</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BaseHero;
