import styled from 'styled-components';

const DateRangeStyle = styled.div`
  .ant-picker-range {
    background-color: #050506;
    border-color: #38383a;
  }
  .ant-picker {
    .ant-picker-clear,
    .ant-picker-suffix, 
    .ant-picker-separator {
      background: transparent;
      color: #6052fb;
    }
    .ant-picker-input > input {
      color: #ffffff;
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  .ant-picker-range .ant-picker-active-bar {
    background: #6052fb;
  }
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 16px;
    .ant-picker-range {
      width: 100%;
    }
  }
`;

export default DateRangeStyle;
