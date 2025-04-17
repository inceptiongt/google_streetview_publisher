"use client"
import React from 'react';
import { Button, Col, Layout, Menu, Popover, Row, theme } from 'antd';
import type { MenuProps } from 'antd'
import { usePathname, useRouter } from 'next/navigation';
import { User } from 'next-auth';
import Image from "next/image";
import Link from 'next/link'
import { signOut } from "@/services"



const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        label: '首页',
        key: '/'
    },
    {
        label: '创建图片',
        key: 'upload'
    },
    {
        label: '图片列表',
        key: 'list'
    },
]

const App: React.FC<{ children: React.ReactNode, user?: User }> = ({ children, user }) => {
    const pathname = usePathname()
    const router = useRouter()
    const {
        token: { colorBgContainer, borderRadiusLG },
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
                    background:'#ffffff'
                }}
            >
                <div className="demo-logo" />
                <Menu
                    // theme="dark"
                    mode="horizontal"
                    //   defaultSelectedKeys={['2']}
                    selectedKeys={[pathname.substring(1)]}
                    onClick={(e) => { router.push(e.key) }}
                    items={menuItems}
                    style={{ flex: 1, minWidth: 0 }}
                />
                {
                    user ? (
                        <Row>
                            <Col>
                                <Popover content={popContent}>
                                    {user?.email}
                                    <Image alt="" width={30} height={30} src={user?.image ?? ''} style={{ verticalAlign: "middle" }} />
                                </Popover>
                            </Col>
                        </Row>
                    ) : (
                        <Row>
                            <Link href={'/login'}>Login</Link>
                        </Row>
                    )
                }

            </Header>
            <Content >
                <div
                    style={{
                        // padding: 24,
                        minHeight: "100vh",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        width: '1200px',
                        margin:'0 auto',
                        marginTop: '12px'
                    }}
                >
                    {children}
                </div>
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}>
                Footer
            </Footer> */}
        </Layout>
    );
};

export default App;