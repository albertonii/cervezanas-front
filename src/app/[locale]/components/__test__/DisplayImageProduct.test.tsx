import { render, screen } from '@testing-library/react';
import DisplayImageProduct from '../ui/DisplayImageProduct';

describe('Display Image Product', () => {
    it('Should render the image', () => {
        render(
            <DisplayImageProduct imgSrc="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" />,
        );
        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
    });
});
