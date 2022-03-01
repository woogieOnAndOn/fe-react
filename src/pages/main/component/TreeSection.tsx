/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icon, Button } from 'semantic-ui-react'
import React, { useState, useEffect, useContext } from 'react';
import { TreeContext, TreeProvider } from '../../../contexts/TreeContext';
import { TreeActionType } from '../../../reducer/tree/actions';
import TreeService from '../../../service/tree.service';

import { Message } from '../../../model/common.model';
import { Tree, ActionType, TreeType, RequestUpdateSeqTree, UpDown, TreeSearchCondition } from '../../../model/tree.model';
import parseMd from '../../../util/Parser.util';
import { findAndUpdateTree } from '../../../util/Tree.util';

interface PropTypes {  }

const TreeSection: React.FC<PropTypes> = (props: PropTypes) => {
  const { treeState, treeDispatch } = useContext(TreeContext);
  const treeService = new TreeService();

  const initialTree = {
    id: 0,
    type: TreeType.FORDER,
    name: '',
    content: '',
    depth: 0,
    parent: {},
    parentId: 0,
    secret: 0,
    children: [],
    upperIndex: [],
    upperName: [],
  };

  const showDirectories = (async (data: Tree, index: number) => {
    const newSearchCondition: TreeSearchCondition = {
      depth: data.depth + 1,
      parent: data.id,
      secret: 0,
    };
    retrieveTree(newSearchCondition)
      .then(response => {
        let updatedTrees: Tree[] = [];
        if (newSearchCondition.depth === 1) {
          updatedTrees = response;
        } else {
          data.children = response;
          let tmpState: Tree[] = treeState.datas;
          updatedTrees = findAndUpdateTree(tmpState, data);
        }
        
        treeDispatch({
          type: TreeActionType.SET_SEARCH_RESULT,
          datas: updatedTrees
        });
      });
  });

  const retrieveTree = async (searchCondition: any) => {
    let response = [];
    const result: Message = await treeService.retrieveTree(searchCondition);
    if (result && result.msId) {
      response = result.msObject;
    } else {
      alert(result.msContent);
    }
    return response;
  }

  const deleteTree = async (data: any) => {
    const request = {
      id: data.id,
      type: data.type,
    };

    const result: Message = await treeService.deleteTree(request);
    if (result && result.msId) {
      if (data.upperIndex) {
        showDirectories(data.parent, data.upperIndex[data.upperIndex.length-1]);
      } else {
        retrieveTree({})
          .then(response => {
            treeDispatch({
              type: TreeActionType.SET_SEARCH_RESULT,
              datas: response
            });
          })
      }
    } else {
      alert(result.msContent);
    }
  }

  const upTree = async (data: Tree) => {
    const request: RequestUpdateSeqTree = {
      id: data.id,
      type: data.type,
      depth: data.depth,
      parent: data.parentId,
      upDown: UpDown.UP,
    }

    const result: Message = await treeService.updateSeqTree(request);
    if (result && result.msId) {
      if (data.upperIndex) {
        showDirectories(data.parent, data.upperIndex[data.upperIndex.length-1]);
      } else {
        retrieveTree({})
          .then(response => {
            treeDispatch({
              type: TreeActionType.SET_SEARCH_RESULT,
              datas: response
            });
          })
      }
    } else {
      alert(result.msContent);
    }
  };

  const downTree = async (data: Tree) => {
    const request: RequestUpdateSeqTree = {
      id: data.id,
      type: data.type,
      depth: data.depth,
      parent: data.parentId,
      upDown: UpDown.DOWN,
    }

    const result: Message = await treeService.updateSeqTree(request);
    if (result && result.msId) {
      if (data.upperIndex) {
        showDirectories(data.parent, data.upperIndex[data.upperIndex.length-1]);
      } else {
        retrieveTree({})
          .then(response => {
            treeDispatch({
              type: TreeActionType.SET_SEARCH_RESULT,
              datas: response
            });
          })
      }
    } else {
      alert(result.msContent);
    }
  };

  // 액션 버튼 보이기
  const handleShowActionBtns = () => {
    treeDispatch({
      type: TreeActionType.SET_SHOW_ACTION_BTNS,
      showActionBtns: !treeState.showActionBtns,
    });
  };

  // 창 띄우기 
  const showCreate = async (data: Tree, index: number) => {
    if (!data.upperIndex) data.upperIndex = [];
    data.upperIndex.push(index);
    treeDispatch({
      type: TreeActionType.SET_TARGET_TREE_AND_ACTION_TYPE,
      targetTree: data,
      actionType: ActionType.CREATE
    });
    document.getElementById('preview')!.innerHTML = await parseMd('');
  }

  const showFile = async (data: Tree) => {
    treeDispatch({
      type: TreeActionType.SET_TARGET_TREE_AND_ACTION_TYPE,
      targetTree: data,
      actionType: ActionType.READ
    });
    document.getElementById('fileViewContent')!.innerHTML = await parseMd(data.content);
  }

  const showEdit = async (data: Tree) => {
    treeDispatch({
      type: TreeActionType.SET_TARGET_TREE_AND_ACTION_TYPE,
      targetTree: data,
      actionType: ActionType.UPDATE
    });

    document.getElementById('preview')!.innerHTML = await parseMd(data.content);
  }

  const showDelete = (data: Tree) => {
    let result;
    if (data.type === TreeType.FORDER)      result = window.confirm('선택 폴더를 삭제하시겠습니까?\n해당 폴더의 하위 파일들이 모두 삭제됩니다.');
    else if (data.type === TreeType.FILE) result = window.confirm('선택 파일을 삭제하시겠습니까?');

    if (result) {
      deleteTree(data);
    }
  }
  // ===================================================창띄우기

  useEffect(() => {
    // console.log('useEffect');
    showDirectories(treeState.searchCondition, treeState.searchIndex);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeState.upsertTree]);

  type myType = { data: Tree, index: number, folderTotalCount: number, fileTotalCount: number};
  const RecursiveComponent = ({data, index, folderTotalCount, fileTotalCount}: myType) => {
    const hasChildren = data.children ? true : false;
    let childFolderTotalCount = 0;
    let childFileTotalCount = 0;
    if (hasChildren) {
      childFolderTotalCount = data.children.filter(data => data.type === TreeType.FORDER).length;
      childFileTotalCount = data.children.filter(data => data.type === TreeType.FILE).length;
    }

    return (
      <div key={data.id} style={{ margin: "5px 0px 5px 5px"}}>
        {
          {
            [TreeType.FORDER]:
              <div> 
                <Button color='orange' onClick={() => showDirectories(data, index)}>
                  <Icon name='folder open outline' />
                  {data.name}
                </Button>
                <Button.Group basic size='mini' style={{display: treeState.showActionBtns || 'none'}}>
                  <Button icon='plus square outline' onClick={() => showCreate(data, index)} />
                  <Button icon='edit outline' onClick={() => showEdit(data)} />
                  <Button icon='trash alternate outline' onClick={() => showDelete(data)} />
                  <Button icon='angle up' onClick={() => upTree(data)} style={{display: index === 0 && 'none'}} />
                  <Button icon='angle down' onClick={() => downTree(data)} style={{display: index === folderTotalCount-1 && 'none'}} />
                </Button.Group>
              </div>
            ,
            [TreeType.FILE]:
              <div>
                <Button color='blue' onClick={() => showFile(data)} >
                  <Icon name='file alternate outline' />
                  {data.name}
                </Button>
                <Button.Group basic size='mini' style={{display: treeState.showActionBtns || 'none'}}>
                  <Button icon='edit outline' onClick={() => showEdit(data)} />
                  <Button icon='trash alternate outline' onClick={() => showDelete(data)} />
                  <Button icon='angle up' onClick={() => upTree(data)} style={{display: index === folderTotalCount && 'none'}} />
                  <Button icon='angle down' onClick={() => downTree(data)} style={{display: index === folderTotalCount+fileTotalCount-1 && 'none'}} />
                </Button.Group>
              </div>
          }[data.type]
        }
        {hasChildren && data.children.map((item: any, idx: number) => (
          <div key={data.id + idx} style={{marginLeft: "20px"}}>
            <RecursiveComponent key={item.id} data={item} index={idx} folderTotalCount={childFolderTotalCount} fileTotalCount={childFileTotalCount}/>
          </div>
        ))}
      </div>
    )
  }

  const folderTotalCount = treeState.datas && treeState.datas!.filter(data => data.type === TreeType.FORDER).length;
  const fileTotalCount = treeState.datas && treeState.datas!.filter(data => data.type === TreeType.FILE).length;

  return (
    <>
      <Button.Group widths='2' color='green' style={{ margin: "0px 0px 8px 0px"}}>
        <Button onClick={() => handleShowActionBtns()}>수정</Button>
        <Button>검색</Button>
      </Button.Group>
      <Button color='black' onClick={() => {
        retrieveTree({})
          .then(response => {
            treeDispatch({
              type: TreeActionType.SET_SEARCH_RESULT,
              datas: response
            });
          });
      }} >
        user
      </Button>
      <Button.Group basic size='mini' style={{display: treeState.showActionBtns || 'none'}}>
        <Button icon='plus square outline' onClick={() => showCreate(initialTree, 0)} />
      </Button.Group>
      {treeState.datas && treeState.datas!.map((data, index) => (
        <RecursiveComponent key={index} data={data} index={index} folderTotalCount={folderTotalCount} fileTotalCount={fileTotalCount}/>
      ))}
    </>
  )
}

export default TreeSection;