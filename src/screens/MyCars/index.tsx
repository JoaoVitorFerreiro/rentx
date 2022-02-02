import React, { useState ,useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';
import { Alert, FlatList, StatusBar } from 'react-native';

import { useTheme } from 'styled-components';
import { AntDesign } from '@expo/vector-icons'

import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';

import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';


import {
   Container,
   Header,
   Title,
   SubTitle,
   Content,
   Appointments,
   AppointmentsTitle,
   AppointmentsQuantify,
   CarWrapper,
   CarFooter,
   CarFooterTitle,
   CarFooterPeriod,
   CarFooterDate,
} from './styles';
import { Load } from '../../Load';

interface CarProps {
   id: string;
   user_id: string;
   car: CarDTO;
   startDate: string,
   endDate: string,
}

export function MyCars(){
   const [cars, setCars] = useState<CarProps[]>([])
   const [loading, setLoading] = useState(true);
   const navigation = useNavigation<any>();
   const theme = useTheme();

   function handleGoBack(){
      navigation.goBack();
   }
   
   async function DeleteRental(id: string) {
      await api.delete(`schedules_byuser/${id}`)
   }

   function HandleAlertDeleteRental(id: string, car:string){
      Alert.alert(`Você deseja deletar ${String(car)}`,
      "",
      [
        {text: 'Cancelar', },
        {text: 'Deletar', onPress: () => {DeleteRental(id)}},
      ],
        {cancelable: false}
      )
   }

   useFocusEffect(useCallback(()=> {
      async function fetchCars() {
         try {
            const response = await api.get('/schedules_byuser?user_id=1');
            setCars(response.data);
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false)
         }
      }
      fetchCars();
 },[DeleteRental]));

   return (
      <Container>
      <Header>
            <StatusBar
                barStyle="light-content"
                translucent
                backgroundColor="transparent"
            />
            <BackButton 
                onPress={handleGoBack}
                color={theme.colors.shape}
            />

            <Title>
                Escolha uma {`\n`}
                data de início e {`\n`}
                fim do aluguel {`\n`}
            </Title>

            <SubTitle>Conforto, segurança e praticidade</SubTitle>
      </Header>

      {loading ? <Load/> :

      <Content>
         <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantify>{cars.length}</AppointmentsQuantify>
         </Appointments>

         <FlatList
            data={cars}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
               <CarWrapper>
                  <Car data={item.car} onPress={() => HandleAlertDeleteRental(item.id,item.car.name)}/>
                  <CarFooter>
                     <CarFooterTitle>Periodo</CarFooterTitle>
                 

                  <CarFooterPeriod>
                     <CarFooterDate>{item.startDate}</CarFooterDate>
                     <AntDesign
                        name="arrowright"
                        size={20}
                        color={theme.colors.title}
                        style={{marginHorizontal:10}}
                     />
                     <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                  </CarFooter>
               </CarWrapper>
            )}
         
         />
      </Content>
      }
      </Container>
);
}