import { AccordionItem, AccordionButton, AccordionPanel, Box } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
interface IAccordionCutoms {
  title: string;
  desc: string;
}
const AccordionCustoms = ({ desc, title }: IAccordionCutoms) => {
  return (
    <AccordionItem
      border={'1px solid #38383A'}
      padding={'10px'}
      borderRadius={'10px'}
      backgroundColor={'rgba(28, 28, 30, 0.5)'}
      marginBottom={'15px'}
    >
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left" fontSize={'20px'} textColor={'white'} lineHeight={1.2}>
                {title}
              </Box>
              {isExpanded ? (
                <MinusIcon fontSize="12px" marginLeft={'15px'} />
              ) : (
                <AddIcon fontSize="12px" marginLeft={'15px'} />
              )}
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} fontSize={'xs'} textColor={'#9E9E9F'}>
            {desc}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};
export default AccordionCustoms;
