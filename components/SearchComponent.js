import styled from "styled-components";
import {Button, Input} from "antd/lib";
import {FlexBox} from "@/components/common";
import { useMediaQuery } from 'react-responsive'
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {useAppContext} from "@/context/app.context";


const SearchComponent = () => {
    const search = new useSearchParams();
    const category = search.get('category');
    const location = search.get('location');
    const { location : savedLocation } = useAppContext();



    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })
    const [form, setForm ]  = useState({
        category: '',
        location: ''
    })

    useEffect(() => {
        if (savedLocation) {
            setForm(prevState => ({
                ...prevState,
                location: savedLocation
            }))
        }
        if (category) {
            setForm(prevForm => ({
                ...prevForm,
                category
            }));
        }

        if (location) {
            setForm(prevForm => ({
                ...prevForm,
                location
            }));
        }
    }, [category, location, savedLocation])

    const router = useRouter();
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const showLocationInput = !isTabletOrMobile || ( isTabletOrMobile && form?.category.length > 0)
    const handleOnChange = (type) => (e) => {
        setForm({
            ...form,
            [type]: e.target.value
        })
    }

    const handleSearchSubmit = () => {

        const encodedCategory = encodeURI(form?.category);
        const encodedLocation = encodeURI(form?.location);
        router.push(`/search?category=${encodedCategory}&location=${encodedLocation}`)
    }
    return (
        <Container>
            <FlexBox wrap={'no-wrap'}>
                <Input value={form?.category} onChange={handleOnChange('category')} className={'search-input'} placeholder={'breakfast, arcades, dinner'} />
                { <Input value={form?.location}  onChange={handleOnChange('location')} className={'search-input'} placeholder={'location'} /> }
                <Button onClick={handleSearchSubmit} type={'primary'} className={'search-btn'}> Search</Button>
            </FlexBox>
        </Container>
    )
}

export default SearchComponent;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
