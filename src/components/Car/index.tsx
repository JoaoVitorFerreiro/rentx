import React from 'react';

import { CarDTO } from '../../dtos/CarDTO'

import {
   Container,
   Details,
   Brand,
   Name,
   About,
   Rent,
   Type,
   Period,
   Price,
   CarImage
} from './styles';
import { getAcessoryIcon } from '../../utils/getAcessoryIcon';

import { RectButtonProps } from 'react-native-gesture-handler';

interface Props extends RectButtonProps{
    data: CarDTO;
    onPress: () => void;
}

export function Car( { data, onPress,...rest } : Props){
    const MotorIcon = getAcessoryIcon(data.fuel_type);
   return (
      <Container onPress={onPress} {...rest}>
          <Details>
              <Brand>{data.brand}</Brand>
              <Name>{data.name}</Name>
          

          <About>
            <Rent>
                <Period>{data.rent.period}</Period>
                <Price>{`R$ ${data.rent.price}`}</Price>
            </Rent>

            <Type>
                <MotorIcon/>
            </Type>
          </About>
          </Details>

          <CarImage 
            source={{uri:data.thumbnail}}
            resizeMode='contain'
          />
      </Container>
);
}