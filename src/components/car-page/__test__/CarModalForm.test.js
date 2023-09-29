import renderer from "react-test-renderer";
import React from "react";
import {CarModalForm} from "../CarModalForm";
import {getByText, render, screen, waitFor} from "@testing-library/react";

const anyCar = () => ({
    brand: '',
    model: '',
    year: '',
    color: '#000000',
    kilometers: '',
    maintenance_values: []
})

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));


it('CarModalForm should match with snapshot', () => {
    const component = renderer.create(
        <CarModalForm car={null} open={false} closeModal={null}/>
    )

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

describe("check modal form title", () => {
    it.each([
        {car: null, expected_title: 'Agregar auto'},
        {car: anyCar(), expected_title: 'Editar auto'}
    ])("when status is '$status' should have icon '$iconId'", async ({car , expected_title}) => {
        render(
            <CarModalForm car={car} open={true} closeModal={null} />
        )
        await screen.findByText(expected_title)
    })
});


