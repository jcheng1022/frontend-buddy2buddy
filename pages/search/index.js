import styled from "styled-components";
import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useSearchResults} from "@/hooks/app.hooks";
import Layout from "@/layouts";
import YelpResultsList from "@/components/YelpResultsList";

const SearchPage = () => {
    const searchParams = new useSearchParams()
    const router = useRouter();
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const {data, isLoading, isError, isSuccess} = useSearchResults(category, location);
    // const {category, location} = router.query;


   useEffect(() => {
       const missingParams = !category &&  !location;
       if (missingParams && !!searchParams ) {
           console.log(`missing`)
       }
   }, [searchParams])

    return (
        <Layout>
            <Container>
                <YelpResultsList list={data}/>
            </Container>
        </Layout>
    )
}

export default SearchPage;

const Container = styled.div`
  padding: 12px 24px;
`
