import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import React from 'react';
import { useSession } from 'next-auth/react';
import Post from '../pages/posts/preview/[slug]';

import { useRouter } from 'next/router';


const post = {
    slug:'my-new-post',
    title: 'My New Post',
    content: '<p>Post excerpt</p>', 
    updatedAt: '10 de Abril'
}

jest.mock('next-auth/react');
jest.mock('next/router');
jest.mock('../services/prismic')

describe('Post preview page', () => {
    it('renders correctlyy', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<Post post={post} />)

        expect(screen.getByText('My New Post')).toBeInTheDocument();
        expect(screen.getByText('Post excerpt')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    })

    it('redirects user to full post when user is subscribed', async() => {
        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce({
            data: { activeSubscription: 'fake-active-subscription', expires: null},
            status: 'authenticated'
        } as any);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any)

        render(<Post post={post} />)

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')

    })

    // it('loads initial data', async () => {
    //     const getSessionMocked = mocked(getSession);
    //     const getPrismicClientMocked = mocked(getPrismicClient);

    //     getPrismicClientMocked.mockReturnValueOnce({
    //         getByUID: jest.fn().mockResolvedValueOnce({
    //             data: {
    //                 title: [
    //                     {
    //                         type: 'heading', text:'My new post'
    //                     }
    //                 ],
    //                 content: [
    //                     {
    //                         type: 'paragraph', text: 'Post content', spans: []
    //                     }
    //                 ],
    //             },
    //             last_publication_date: '04-01-2021'
    //         })
    //     } as any)

    //     getSessionMocked.mockResolvedValueOnce({
    //         activeSubscription: 'fake-active-subscription'
    //     }as any)

    //     const response = await getServerSideProps({params: {
    //         slug: 'my-new-post'
    //     }} as any)  

    //     expect(response).toEqual(
    //         expect.objectContaining({
    //             props: {
    //                 post: {
    //                     slug: 'my-new-post',
    //                     title: 'My new post',
    //                     content: '<p>Post content</p>',
    //                     updatedAt: '01 de abril de 2021'
    //                 }
    //             }
    //         })
    //     )
    // })
})