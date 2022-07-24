/* eslint-disable react/jsx-props-no-spreading */
import HeaderComponent from '../components/Headers/Header';

export default {
  title: 'Header',
  component: HeaderComponent,
};

function Template(args) {
  return <HeaderComponent {...args} />;
}

export const HeaderTest = Template.bind({});
HeaderTest.args = {
  backgroundColor: 'red',
};
