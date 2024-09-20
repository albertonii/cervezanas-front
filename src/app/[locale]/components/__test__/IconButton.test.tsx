import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { render, screen } from '@testing-library/react';
import { IconButton } from '../ui/IconButton';
import userEvent from '@testing-library/user-event';

const mockHandleClick = jest.fn();

describe('IconButton', () => {
    it('Should render the icon', () => {
        render(
            <IconButton
                icon={faHeart}
                title="like"
                color={{ filled: 'red', unfilled: 'grey' }}
            />,
        );

        const iconBtn = screen.getByTestId('like');
        expect(iconBtn).toBeInTheDocument();
    });
});

describe('Behaviour', () => {
    it('should click with onClick parameter', async () => {
        render(
            <IconButton
                icon={faHeart}
                title="like"
                color={{ filled: 'red', unfilled: 'grey' }}
                onClick={mockHandleClick}
            />,
        );

        const button = screen.getByTestId('like');

        await userEvent.click(button);

        expect(mockHandleClick).toHaveBeenCalledTimes(1);
    });
});
