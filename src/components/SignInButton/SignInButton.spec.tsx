import {render, screen} from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { mocked } from 'jest-mock'
import { SignInButton } from '.';

jest.mock('next-auth/react')

describe('SignInButton component', () => {
    it('renders correctly when user is not authenticated', () => {
      
      const useSessionMocked = mocked(useSession);

      useSessionMocked.mockReturnValueOnce([null, false])

      const {debug} = render(<SignInButton />)  

      expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
      debug();
    })

    it('renders correctly when user is authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce({
            data: {
              user: { name: "John Doe", email: "john.doe@example.com" },
              expires: "fake-expires",
            },
          } as any)

        render(<SignInButton />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    })
})