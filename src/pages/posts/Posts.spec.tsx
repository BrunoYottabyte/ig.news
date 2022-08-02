import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import React from 'react';

import Posts, {getStaticProps} from './index';
import { getPrismicClient } from '../../services/prismic';


const posts = [
    {slug:'my-new-post', title: 'My New Post', execerpt: 'Post execerpt', updatedAt: '10 de Abril'}
]

jest.mock('../../services/prismic')

describe('Posts page', () => {
    it('renders correctlyy', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText('My New Post')).toBeInTheDocument();
    })

    it('loads initial data', async() => {

        const getPrismicClientMocked = mocked(getPrismicClient)
        
        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [
                                {
                                    type: 'heading', text:'My new post'
                                }
                            ],
                            content: [
                                {
                                    type: 'paragraph', text: 'Post execerpt'
                                }
                            ],
                        },
                        last_publication_date: '04-01-2021'
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My new post',
                        execerpt: 'Post execerpt',
                        updatedAt: '01 de abril de 2021'
                    }]
                }
            })
        )

    })
})