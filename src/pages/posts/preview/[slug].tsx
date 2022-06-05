import { GetStaticPaths, GetStaticProps } from "next"
import { getPrismicClient } from "../../../services/prismic";
import { asHTML, asText } from "@prismicio/helpers";
import Head  from "next/head";

import styles from '../post.module.scss';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

type Post = {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
}

interface PostPreviewProps {
    post: Post;
}


export default function PostPreview({post}: PostPreviewProps){
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
      
        if (session?.activeSubscription){
            router.push(`/posts/${post.slug}`);
            return;
        }
    }, [session])
    
    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>

                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content}}
                     />

                     <div className={styles.continueReading}>
                         Wanna continue reading?
                         <Link href="/">
                            <a>Subscribe now 🤗</a>
                         </Link>
                     </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async() => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async({params}) => {

    const {slug} = params;

    const prismic = getPrismicClient();

    const response = await prismic.getByUID<any>('publication', String(slug), {});

    const post = {
        slug,
        title: asText(response.data.title),
        content: asHTML(response.data.content.splice(0,3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })

    }

    return {
        props: {
            post
        },
        revalidate: 60 * 30 // 30 min
    }
}