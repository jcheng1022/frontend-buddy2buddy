import {Inter} from 'next/font/google'
import styled from "styled-components";
import Layout from "@/layouts";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
   <Layout>
       <Container>
           test
       </Container>
   </Layout>
  )
}


const Container = styled.div``
