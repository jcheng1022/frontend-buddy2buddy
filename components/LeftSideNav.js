import styled from "styled-components";
import {Map, MapPin, Users} from "react-feather";
import {FlexBox} from "@/components/common";
import {Layout, Tooltip} from "antd/lib";
import {useRouter} from "next/router";
import {useAuthContext} from "@/context/auth.context";

const {Sider} = Layout;
const LeftSideNav = () => {
    const router = useRouter();
    const { user } = useAuthContext();
    const iconProps = {
        color: 'white',
        size: 20
    }
    const onNavClick = (item) => () => {
        let url = item?.url ? item.url : `/me?${new URLSearchParams({ type: item.type }).toString()}`
        router.push(url);

    }

    const items = [
        {
            logo: <MapPin {...iconProps} />,
            name: 'Business Search',
            type: 'business'
        },
        {
            logo: <Map {...iconProps} />,
            name: 'Planner',
            type: 'planner'
        },
    ]

    if (!!user) {
        items.push(
            {
                logo: <Users {...iconProps} />,
                url: `/user/${user?.id}/friends`,
                name: 'friends',
                type: 'friends',
            },
        )
    }
    return (
        <Sider width={60}>
            <Container direction={'column'} gap={18}>
                {items.map((item) => {
                    return (
                        <Tooltip title={item.name} placement={'right'}>
                            <div className={'nav-icons'} onClick={onNavClick(item)}>
                                {item.logo}
                            </div>
                        </Tooltip>
                    )
                })}

                <FlexBox justify={'flex-end'}>
                    test
                </FlexBox>
            </Container>
        </Sider>
    )
}

export default LeftSideNav;

const Container = styled(FlexBox)`
  min-width: 54px;
  
  max-width: 54px;
  padding: 12px 8px;
  //min-height: 100%;
  //max-height: 1005;
  height: 100vh;
  background-color: #2b2b2b;
  
  .nav-icons {
    cursor: pointer;
  }
  .nav-icons:hover {
    opacity: .8;
  }
`
