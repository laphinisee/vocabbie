import React from 'react';
import { render as reactRender } from 'react-testing-library';
import {ArticleUpload} from './ArticleUpload';
import 'jest-dom/extend-expect'
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

it('renders three upload options', () => {
    const { getByText } = reactRender(<ArticleUpload />);
    expect(getByText('Plain Text')).toBeInTheDocument();
    expect(getByText('File Upload')).toBeInTheDocument();
    expect(getByText('URL')).toBeInTheDocument();
});

it('plain text form validation is correct', () => {
    const wrapper = mount(<ArticleUpload />);
    const title = wrapper.find("input[name='title']")
    const plainText = wrapper.find("textarea")
    const button = wrapper.find("button[name='plainTextGenerate']")

    expect(button.get(0).ref.current.disabled).toBeTruthy()

    expect(title.get(0).ref.current.value).toEqual("")
    title.simulate('change', { target: { name: 'title', value: 'Some title' } })
    expect(title.get(0).ref.current.value).toEqual('Some title')

    expect(plainText.get(0).ref.current.value).toEqual("")
    plainText.simulate('change', { target: { name: 'plainText', value: 'Some text' } })
    expect(plainText.get(0).ref.current.value).toEqual('Some text')

    expect(button.get(0).ref.current.disabled).toBeFalsy()
});

it('submits a post request to backend', () => {
    const router = {
        push: jest.fn()
    }
    const mockSuccessResponse = {"id":"5cc72c418d4aff5ad45f0ed4"};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
        json: () => mockJsonPromise,
        status: 200,
      });
      jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
      jest.spyOn(router, 'push').mockImplementation(() => mockFetchPromise);

      const mockUser = {
        token: 'fakeToken',
    }
    const wrapper = mount(<ArticleUpload user={mockUser} history={router}/>);
    const title = wrapper.find("input[name='title']")
    const plainText = wrapper.find("textarea")
    const button = wrapper.find("button[name='plainTextGenerate']")

    expect(button.get(0).ref.current.disabled).toBeTruthy()

    expect(title.get(0).ref.current.value).toEqual("")
    title.simulate('change', { target: { name: 'title', value: 'Some title' } })
    expect(title.get(0).ref.current.value).toEqual('Some title')

    expect(plainText.get(0).ref.current.value).toEqual("")
    plainText.simulate('change', { target: { name: 'plainText', value: 'Some text' } })
    expect(plainText.get(0).ref.current.value).toEqual('Some text')

    button.simulate('click', {})

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/generate-text', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'fakeToken',
        },
        redirect: "follow", // manual, *follow, error
        body: JSON.stringify({
          plainText: 'Some text',
          title: 'Some title',
        }), // body data type must match "Content-Type" header
      })

    process.nextTick(() => { // 6
        expect(router.push).toHaveBeenCalledWith('/display/5cc72c418d4aff5ad45f0ed4')
        global.fetch.mockClear(); // 7
    });
})