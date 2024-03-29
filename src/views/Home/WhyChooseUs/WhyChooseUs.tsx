import { BaseCard } from '../../../components/ui';

import { IContent } from '../../../interfaces/content-interface';
import { IArticle } from '../../../interfaces/article-interface';

import styles from './WhyChooseUs.module.scss';

interface IWhyChooseUsProps {
  content: IContent;
}

const WhyChooseUs = ({ content }: IWhyChooseUsProps) => {
  const { title, description, listing } = content;

  return (
    <section className={ styles.benefits }>
      <div className="container">
        <BaseCard customClasses={ `${styles['benefits__intro']} | bg-dark-color-2` }>
          <div className="grid-cols">
            <div className="grid__item grid__item--span-md-10 grid__item--start-md-2 grid__item--span-lg-6 grid__item--start-lg-4">
              <h2>{ title }</h2>

              <p>{ description }</p> 
            </div>
          </div>
        </BaseCard>

        {
          listing?.length ? (
            <ul className="grid-cols">
              {
                listing.map((benefit: IArticle) => (
                  <li
                    key={ benefit.id }
                    className={ `grid__item grid__item--span-lg-4 | ${styles['benefits__list-item']}` }
                  >
                    <BaseCard customClasses={ `${styles['benefits__card']} | stack | bg-cyan-color-1` }>
                      <img
                        src={ benefit.imagePath }
                        alt={ benefit.title }
                      />

                      <div className={ styles['benefits__card-body'] }>
                        <h3>{ benefit.title }</h3>

                        <p>{ benefit.description }</p>
                      </div>
                    </BaseCard>
                  </li>
                ))
              }
            </ul>
          ) : (
            <p className={ styles['benefits__error'] }>Sorry, benefits data could not be loaded.</p>
          )
        }
      </div>
    </section>
  );
};

export default WhyChooseUs;
