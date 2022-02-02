import React, {useEffect, useState} from 'react';

import { Acessory } from '../../components/Acessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';


import { Feather } from '@expo/vector-icons'

import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';


import {
   Container,
   Header,
   CarImages,
   Content,
   Details,
   Description,
   Brand,
   Name,
   Rent,
   Period,
   Price,
   Accessories,
   Footer,
   RentalPeriod,
   CalendarIcon,
   DateInfo,
   DateTitle,
   DateValue,
   RentalPrice,
   RentalPriceLabel,
   RentalPriceDetails,
   RentalPriceQuota,
   RentalPriceTotal
} from './styles';

import { getAcessoryIcon } from '../../utils/getAcessoryIcon'

import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { api } from '../../services/api';
import { Alert } from 'react-native';

interface Params{
   car: CarDTO;
   dates: string[];
}
interface RentalPeriod{
   start: string;
   end: string;
}

export function SchedulingDetails(){
 const [loading, setLoading] = useState(false);
 const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);


 const theme = useTheme();
 const navigation = useNavigation<any>();

 const route = useRoute();
 const { car, dates } = route.params as Params;

 const rentTotal = Number(dates.length * car.rent.price);


  async function handleConfirmRental(){
      const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);
      
      const unavailable_dates = [
          ...schedulesByCar.data.unavailable_dates,
          ...dates,
      ]
      setLoading(true);
      await api.post('schedules_byuser', {
         user_id: 1,
         car,
         startDate: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
         endDate: format(getPlatformDate(new Date(dates[dates.length -1])), 'dd/MM/yyyy')
      })
      
      await api.put(`/schedules_bycars/${car.id}`, {
         id: car.id,
         unavailable_dates
      })
      .then(() => navigation.navigate('SchedulingComplete'))
      .catch(() => {
         setLoading(false);
         Alert.alert('Não foi possivel confirmar o agendamento')
      })
   }
   
   function handleGoBack(){
      navigation.goBack();
   }

   useEffect(() => { 
      setRentalPeriod({
         start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
         end: format(getPlatformDate(new Date(dates[dates.length -1])), 'dd/MM/yyyy')
      })
   },[])

   return (
      <Container>
         <Header>
            <BackButton onPress={handleGoBack}/>
         </Header>

         <CarImages>
            <ImageSlider 
               ImagesUrl={car.photos}
            />
         </CarImages>

         <Content>
            <Details>
               <Description>
                  <Brand>{car.brand}</Brand>
                  <Name>{car.name}</Name>
               </Description>

               <Rent>
                  <Period>{car.rent.period}</Period>
                  <Price>R$ {car.rent.price}</Price>
               </Rent>
            </Details>
            
            <Accessories>
               {
                  car.accessories.map(accessory => (
                     <Acessory 
                        key={accessory.type}
                        name={accessory.name}
                        icon={getAcessoryIcon(accessory.type)}
                     />
                  ))
               }
            </Accessories>   

            <RentalPeriod>
               <CalendarIcon>
                  <Feather
                     name="calendar"
                     size={RFValue(24)}
                     color={theme.colors.shape}
                  />
               </CalendarIcon>

               <DateInfo>
                  <DateTitle>DE</DateTitle>
                  <DateValue>{rentalPeriod.start}</DateValue>
               </DateInfo>

               <Feather
                     name="chevron-right"
                     size={RFValue(10)}
                     color={theme.colors.text}
               />

               <DateInfo>
                  <DateTitle>ATE</DateTitle>
                  <DateValue>{rentalPeriod.end}</DateValue>
               </DateInfo>

            </RentalPeriod> 

            <RentalPrice>
               <RentalPriceLabel>TOTAL</RentalPriceLabel>

               <RentalPriceDetails>
                  <RentalPriceQuota>{`R$ ${car.rent.price} x${dates.length} diárias`}</RentalPriceQuota>
                  <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
               </RentalPriceDetails>
            </RentalPrice>


         </Content>

         <Footer>
          <Button 
            title="Alugar agora" 
            onPress={handleConfirmRental} 
            color={theme.colors.success}
            loading={loading}
            enabled={!loading}
          />
         </Footer>
      </Container>
);
}