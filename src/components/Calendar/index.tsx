import React from 'react';

import { Feather } from '@expo/vector-icons'
import { ptBr } from './localeConfig'

import { 
    Calendar as CustomCalendar,
    LocaleConfig,
    CalendarProps
} from 'react-native-calendars'
import { generateInterval } from './generateInterval'

LocaleConfig.locales['pt-br'] = ptBr

LocaleConfig.defaultLocale = 'pt-br';

import { useTheme } from 'styled-components';

interface MarkedDateProps {
    [date: string] : {
        color: string;
        textColor: string;
        desabled?: boolean;
        desableTouchEvent?: boolean;
    }
}

interface DayProps {
    dateString: string
    day: number;
    month: number;
    year: number
    timestamp: number;
}

function Calendar({ markedDates, onDayPress } : CalendarProps ){
   const theme = useTheme();
   return (
      <CustomCalendar
        renderArrow={( direction ) =>
            <Feather
                size={24}
                color={theme.colors.text}
                name={direction == 'left' ? "chevron-left" : "chevron-right"}
            />
        }
        
        headerStyle={{
            backgroundColor: theme.colors.background_secondary,
            borderBottomWidth: 0.5,
            borderBottomColor: theme.colors.text_detail,
            paddingBottom: 10,
            marginBottom: 10

        }}

        theme ={{
            textDayFontFamily: theme.fonts.primary_400,
            textDayHeaderFontFamily: theme.fonts.primary_400,
            textMonthFontFamily: theme.fonts.secondary_600,
            textDayHeaderFontSize: 10,
            textMonthFontSize:20,
            monthTextColor: theme.colors.title,
            arrowStyle:{
                marginHorizontal: -15
            }
        }}

        firstDay={1}

        minDate={String(new Date())}

        markingType='period'
        markedDates={markedDates}
        onDayPress={onDayPress}
      />
);
}

export {
    Calendar,
    MarkedDateProps,
    DayProps,
    generateInterval
}