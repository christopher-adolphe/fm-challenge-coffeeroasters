import { useState, useEffect, useCallback, useContext, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import AppContext from '../../../context/AppContext';

import { BaseAccordion, BaseOrderSummary, BaseModal } from '../../../components/ui';
import { BaseRadio } from '../../../components/form';

import { IPlan } from '../../../interfaces/plan-interface';
import { IFormData } from '../../../interfaces/form-data-interface';

import styles from './Order.module.scss';

interface IOrderProps {
  orderOptions: IPlan[];
}

interface IQuickLink {
  id: string;
  slug: string;
  label: string;
  isActive: boolean;
  isDisabled: boolean;
  isValid: boolean;
}

const priceMap = new Map([
  ['250g', [7.2, 9.6, 12]],
  ['500g', [13, 17.5, 22]],
  ['1000g', [22, 32, 42]],
]);

const Order = ({ orderOptions }: IOrderProps) => {
  const { onSetCheckout } = useContext(AppContext);
  const [ quickLinks, setQuickLinks ] = useState<IQuickLink[]>(
    orderOptions.map((orderOption, index) => ({
      id: orderOption.id,
      slug: orderOption.slug,
      label: orderOption.quickLink,
      isActive: index === 0 ? true : false,
      isDisabled: false,
      isValid: true,
    }))
  );

  const [ formData, setFormData ] = useState<IFormData>({
    preferences: '',
    beanType: '',
    quantity: '',
    grindOption: '',
    deliveries: '',
  });

  const [ shipmentCost, setShipmentCost ] = useState<number>(0);

  const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleMarkAsActive = (slug: string) => {
    const targetElem = document.getElementById(slug);

    setQuickLinks((quickLinks) => {
      const updatedQuickLinks = quickLinks.map(quickLink => ({
        ...quickLink,
        isActive: quickLink.slug === slug ? !quickLink.isActive : false,
      }));

      return updatedQuickLinks;
    });

    targetElem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleUpdateValidity = (slug: string, isValid: boolean) => {
    setQuickLinks((quickLinks) => {
      const index = quickLinks.findIndex(quickLink => quickLink.slug === slug); 
      const updatedQuickLinks = [ ...quickLinks ];

      updatedQuickLinks[index].isValid = isValid;

      return updatedQuickLinks;
    });
  };

  const handleScrollToError = (slug: string) => {
    const targetElem = document.getElementById(slug);

    setQuickLinks((quickLinks) => {
      const updatedQuickLinks = quickLinks.map(quickLink => ({
        ...quickLink,
        isActive: quickLink.slug === slug ? true : false,
      }));

      return updatedQuickLinks;
    });

    targetElem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };


  const handleChange = (name: string, value: string) => {
    setFormData((formData) => {
      const updatedFormData = { ...formData };

      updatedFormData[name as keyof IFormData] = value;

      if (updatedFormData.preferences === 'Capsule') {
        updatedFormData.grindOption = '';
      }

      return updatedFormData;
    });

    handleUpdateValidity(name, true);

    if (value === 'Capsule') {
      handleUpdateValidity('grindOption', true);
    }
  };

  const handleDisableGrindOption = useCallback(() => {
    if (formData.preferences === 'Capsule') {
      setQuickLinks((quickLinks) => {
        const updatedQuickLinks = quickLinks.map(quickLink => ({
          ...quickLink,
          isDisabled: quickLink.slug === 'grindOption' ? true : false,
        }));
  
  
        return updatedQuickLinks;
      });
    } else {
      setQuickLinks((quickLinks) => {
        const updatedQuickLinks = quickLinks.map(quickLink => ({
          ...quickLink,
          isDisabled: false,
        }));
  
  
        return updatedQuickLinks;
      });
    }
  }, [formData]);

  const handleGetDeliveryPrice = (index: number): number => {
    let priceList;
    priceList = priceMap.get('250g');

    if (!formData.quantity.length && priceList) {
      return priceList[index];
    }

    priceList = priceMap.get(formData.quantity);

    if (priceList) {
      return priceList[index];
    }

    return 0;
  };

  const handleCalculateCost = () => {
    const { quantity, deliveries } = formData;
    const priceList = priceMap.get(quantity);
    let price = 0;
    let multiplier = 0;

    if (!priceList) {
      return;
    }

    switch (deliveries) {
      case 'Every week':
        price = priceList[0];
        multiplier = 4;
        break;

      case 'Every 2 weeks':
        price = priceList[1];
        multiplier = 2;
        break;

      case 'Every month':
        price = priceList[2];
        multiplier = 1;
        break;
    }

    setShipmentCost(price * multiplier);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    let isFormValid: boolean;
    let invalidFields: string[];

    if (formData.preferences === 'Capsule') {
      const capsulePreference = { ...formData };

      delete capsulePreference.grindOption;

      isFormValid = Object.values(capsulePreference).every(option => option !== '');
      invalidFields = Object.keys(capsulePreference).filter(key => formData[key as keyof IFormData] === '');
    } else {
      isFormValid = Object.values(formData).every(option => option !== '');
      invalidFields = Object.keys(formData).filter(key => formData[key as keyof IFormData] === '');
    }

    if (!isFormValid) {
      invalidFields.forEach(field => {
        handleUpdateValidity(field, false);
      });

      handleScrollToError(invalidFields[0]);
      
      return;
    }

    setIsModalVisible(true);

    handleCalculateCost();
  };

  const handleDismissModal = () => {
    setIsModalVisible((prevIsModalVisible) => !prevIsModalVisible);
  };

  const handleConfirmCheckout = () => {
    onSetCheckout();
    navigate('/checkout');
  };

  useEffect(() => {
    handleDisableGrindOption();
  }, [handleDisableGrindOption]);

  return (
    <section className={ styles.order }>
      <div className="container">
        <div className={ styles['order__content'] }>
          <div className="grid-cols">
            <div className={ `grid__items grid__item--span-lg-3 | ${styles['order__col-left']}` }>
              <ul className={ styles['order__link-list'] }>
                {
                  quickLinks.map(quickLink => (
                    <li className={ styles['order__link-list-item'] } key={ quickLink.id }>
                      <button
                        type="button"
                        id={ `quicklink-${quickLink.slug}` }
                        className={ `btn | ${styles['order__link-list-btn']} ${quickLink.isActive ? `${styles['active']}` : ''}` }
                        disabled={ quickLink.isDisabled }
                        onClick={ () => handleMarkAsActive(quickLink.slug) }
                      >
                        { quickLink.label }
                        { !quickLink.isValid ? (
                          <span
                            className="btn"
                            data-variant="burger"
                            aria-label="is invalid"
                            role="img"
                          ></span>
                        ) : null }
                      </button>
                    </li>
                  ))
                }
              </ul>
            </div>

            <div className="grid__items grid__item--span-lg-8 grid__item--start-lg-5">
              <form className={ styles['order__form'] } onSubmit={ handleSubmit }>
                {
                  orderOptions.map((orderOption, index) => (
                    <BaseAccordion
                      key={ orderOption.id }
                      id={ orderOption.slug }
                      initialState={ quickLinks[index].isActive }
                      isDisabled={ quickLinks[index].isDisabled }
                      label={ orderOption.title }
                      onMarkAsActive={ handleMarkAsActive }
                    >
                      {
                        !quickLinks[index].isValid ? (
                          <div className={ `${styles['order__form-feedback']} | text-font-bold text-size-s-1` } role="alert">
                            <span>Please select your { quickLinks[index].label }!</span>
                          </div>
                        ) : null
                      }

                      <div className={ `row | ${styles['order__form-group']}` }>
                        {
                          orderOption.options.map((option, index) => (
                            <BaseRadio
                              key={ option.id }
                              id={ option.id }
                              value={ option.title }
                              name={ orderOption.slug }
                              label={ option.title }
                              description={ orderOption.slug === 'deliveries' ? `$${handleGetDeliveryPrice(index).toFixed(2)} ${option.description}` : option.description }
                              checked={ formData[orderOption.slug as keyof IFormData] === option.title }
                              onHandleChange={ handleChange }
                            />
                          ))
                        }
                      </div>
                    </BaseAccordion>
                  ))
                }

                <BaseOrderSummary formData={ formData } />

                <button type="submit" className={ `btn | ${styles['order__btn-submit']}` }>Create my plan!</button>
              </form>

              {
                isModalVisible ? (
                  createPortal(
                    <BaseModal title="Order Summary" onDismiss={ handleDismissModal }>
                      <BaseOrderSummary formData={ formData } variant="light" />
    
                      <p className={ styles['order__modal-text'] }>Is this correct? You can proceed to checkout or go back to plan selection if something is off. Subscription discount codes can also be redeemed at the checkout.</p>
                      
                      <div className={ `row | ${styles['order__modal-action']}`}>
                        <h3>{ `$${shipmentCost?.toFixed(2)}` }/mo</h3>
    
                        <button type="button" className="btn" onClick={ handleConfirmCheckout }>
                          Checkout<span>&nbsp;-&nbsp;{ `$${shipmentCost?.toFixed(2)}` }/mo</span>
                        </button>
                      </div>
                    </BaseModal>,
                    document.getElementById('modal-root') as HTMLElement)
                ) : null
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Order;
