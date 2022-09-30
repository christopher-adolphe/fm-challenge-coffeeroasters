import { Link } from 'react-router-dom';

import { BaseCard } from '../../ui';

import { IWorkingStep } from '../../../interfaces/working-step-interface';

import styles from './BaseHowItWorks.module.scss';

interface IBaseHowItWorksProps {
  steps: IWorkingStep[];
  variant?: string;
  withTitle?: boolean;
  withCTA?: boolean;
}

const BaseHowItWorks = ({ steps, variant = 'default', withTitle = true, withCTA = true }: IBaseHowItWorksProps) => {
  return (
    <section className={ styles['how-it-works'] } data-variant={ variant }>
      <div className="container">
        <BaseCard customClasses={ styles['how-it-works__card'] }>
          {
            withTitle ? (
              <h2 className={ styles['how-it-works__title'] }>How it works</h2>
            ) : null
          }

          {
            steps.length
            ? (
              <ul className={ `${styles['how-it-works__list']} | grid-cols` }>
                {
                  steps.map(step => (
                    <li
                      key={ step.id }
                      className={ `${styles['how-it-works__item']} | grid__item grid__item--span-md-4 grid__item--span-lg-4` }
                    >
                      <h3>{ step.title }</h3>

                      <p>{ step.description }</p>
                    </li>
                  ))
                }
              </ul>
            ) : (
              <p className={ styles['how-it-works__error'] }>Sorry, working steps data could not be loaded.</p>
            )
          }

          {
            withCTA ? (
              <Link to="/create-plan" className={ `${styles['how-it-works__cta']} | btn` }>Create your plan</Link>
            ) : null
          }
        </BaseCard>
      </div>
    </section>
  );
};

export default BaseHowItWorks;
