import { render, screen } from '@testing-library/react';

import BaseHero from './BaseHero';

import { contentMap } from '../../../fixtures/contents';

import { IContent } from '../../../interfaces/content-interface';

describe('BaseHero component', () => {
  let data: IContent;

  beforeEach(() => {
    data = contentMap.get('about')![0];
  });

  it('should render a heading', () => {
    render(<BaseHero content={ data } />);

    expect(screen.getByRole('heading')).toHaveTextContent(data.title);
  });

  it('should render a paragraph', () => {
    render(<BaseHero content={ data } />);

    expect(screen.getByText(/Coffeeroasters began its journey/i)).toBeInTheDocument();
  });

  it('should render an image', () => {
    render(<BaseHero content={ data } />);
    const heroImage = screen.getByRole('img');

    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAccessibleName(data.title);
  });
});
