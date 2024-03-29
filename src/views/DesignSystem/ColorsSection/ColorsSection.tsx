import { colors } from '../../../fixtures/colors';

import { BaseSwatch } from '../../../components/ui/';

const ColorsSection = () => {
  return (
    <section className="container | mb-s5">
      <h2 className="sr-only">Colors</h2>

      <div className="grid-cols">
         {
          colors.map(color => (
            <div className="grid__item grid__item--span-lg-4" key={ color.hex }>
              <BaseSwatch colorSwatch={ color }/>
            </div>
          ))
         }
      </div>
    </section>
  );
};

export default ColorsSection;
