import React, { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';

import Logo from '../../assets/logo.svg'

import { RFValue } from 'react-native-responsive-fontsize';

import { Ionicons } from '@expo/vector-icons'

import { api } from '../../services/api'
import { CarDTO } from '../../dtos/CarDTO'
import {
   Container,
   Header,
   TotalCars,
   HeaderContent,
   CarList,
   MyCarButtons
} from './styles';
import { Car } from '../../components/Car';
import { Load } from '../../Load';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';

export function Home(){
   const [ cars, setCars ] = useState<CarDTO[]>([]);
   const [ loading, setLoading ] = useState(true)

   const navigation = useNavigation<any>();
   const theme = useTheme();

   function handleCarDetails(car: CarDTO){
      navigation.navigate('CarDetails', { car })
   }

   function handleOpenMyCars(){
      navigation.navigate('MyCars')
   }
   
   useEffect(() => {
      async function fetchCars() {
         try {
            const response = await api.get('/cars');
            setCars(response.data)
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      }

      fetchCars();
   }, [])

   return (
      <Container>

         <StatusBar 
            style="light"
            backgroundColor='transparent'
            translucent
         />

         <Header>
            <HeaderContent>
               <Logo 
                  height={RFValue(12)}
                  width={RFValue(108)}
               />
               <TotalCars>Total de 12 carros</TotalCars>
            </HeaderContent>
         </Header>
      {loading ? <Load/> :
   <CarList
      data={cars}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Car data={item} onPress={() => handleCarDetails(item)} />}
   >
   </CarList>
   }

   <MyCarButtons
      onPress={handleOpenMyCars}
   >
    <Ionicons 
      name="ios-car-sport"
      size={32}
      color={theme.colors.shape}
    />
   </MyCarButtons>
      </Container>
);
}