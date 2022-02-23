import React from 'react';
import { useNavigate } from 'react-router-dom';
import GraphicsComponent from './graphics_component';

function CardItem(props) {
  let navigate = useNavigate();

  return (
    <div
      onClick={() => {
        return navigate('/Editor/' + props.project._id);
      }}
    >
      <li className='cards__item'>
        <div className='cards__item__link'>
          <figure
            className='cards__item__pic-wrap'
            data-category={props.project.ownerName}
          >
            <div
              className='cards__item__owner-box'
              onClick={(e) => {
                e.stopPropagation();
                return navigate('/UserPage/' + props.project.owner);
              }}
            ></div>
            <GraphicsComponent
              className='cards__item__img'
              pause={props.pause}
              playOnMouseOver={props.playOnMouseOver}
              showButtons={props.showButtons}
              commonFragShaderCustomCode={props.commonFragShaderCustomCode}
              finalFragShaderCustomCode={props.finalFragShaderCustomCode}
              buffer1FragShaderCustomCode={props.buffer1FragShaderCustomCode}
              buffer2FragShaderCustomCode={props.buffer2FragShaderCustomCode}
              buffer3FragShaderCustomCode={props.buffer3FragShaderCustomCode}
              buffer4FragShaderCustomCode={props.buffer4FragShaderCustomCode}
              channels={props.channels}
            />
          </figure>
          <div className='cards__item__info'>
            <h5 className='cards__item__text'>{props.project.title}</h5>
          </div>
        </div>
      </li>
    </div>
  );
}

export default CardItem;
