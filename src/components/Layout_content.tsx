"use client"
import React from 'react';
import { Breadcrumb, Button, Layout, List, Menu, Popover, theme } from 'antd';
import type { MenuProps } from 'antd'
import { usePathname, useRouter } from 'next/navigation';
import { User } from 'next-auth';
import Image from "next/image";
import { signOut } from "@/services"



const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        label: 'Home',
        key: '/'
    },
    {
        label: 'Upload',
        key: 'upload'
    },
    {
        label: 'List',
        key: 'list'
    },
    {
        label: "Login",
        key: 'login'
    }
]

const App: React.FC<{ children: React.ReactNode, user?: User }> = ({ children, user }) => {
    const pathname = usePathname()
    const router = useRouter()
    const {
        token: { colorBgContainer, borderRadiusLG, colorTextHeading },
    } = theme.useToken();

    const popContent = (
        <div>
            <p>{user?.name}</p>
            <p>{user?.email}</p>
            <p><Button type={'primary'} onClick={() => signOut()}>退出</Button></p>
        </div >
    )

    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    //   defaultSelectedKeys={['2']}
                    selectedKeys={[pathname.substring(1)]}
                    onClick={(e) => { console.log('e', e); router.push(e.key) }}
                    items={menuItems}
                    style={{ flex: 1, minWidth: 0 }}
                />
                <div style={{ color: colorTextHeading }}>
                    {user?.email}
                    <Popover content={popContent}>
                        <Image alt="" width={30} height={30} src={user?.image ?? ''} />
                    </Popover>
                </div>
            </Header>
            <Content style={{ padding: '0 48px' }}>
                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default App;