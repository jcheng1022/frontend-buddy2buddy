import styled from 'styled-components';
import {FlexBox} from "@/components/common";
import {theme} from "@/styles/themes";
import {useAuthContext} from "@/context/auth.context";
import {useRouter} from "next/router";
import {LogOut, Settings} from "react-feather";
import {Dropdown} from "antd/lib";

const Header = () => {
    const {user, signOut} = useAuthContext();
    const router = useRouter();
    const username = !user ? '' : !!user?.username ? user.username : 'New User'
    const items = [
        {
            key: 'user-profile',
            icon: <Settings size={12} />,
            label: (
                <div onClick={() => router.push(`/user/${user.id}?tab=today`)}>
                    My Profile
                </div>
            ),
        },
        {
            key: 'user-signout',
            icon: <LogOut size={12}/>,
            label: (
                <div onClick={signOut}>
                    Sign Out
                </div>
            )
        },

    ];
    return (
        <Container justify={'space-between'}>
            {/* Your component content here */}

            <div className={'left-side'}>
                {` Can't think of a name yet`}
            </div>
            {
                user
                    ? <Dropdown menu={{items}}>
                        <div className={'hover-item'}> {username} </div>
                      </Dropdown>
                    : <div  className={'hover-item'} onClick={() => router.push(`/login`)} > Log in</div>
            }
        </Container>
    );
}

export default Header;

const Container = styled(FlexBox)`
  background-color: ${theme.jet};
  color: ${theme.lightLavender};
  font-size: 18px;
  height: 60px;
  padding: 12px 24px;
  
  .hover-item {
    cursor: pointer;
  }
`
