<template>
  <div class="h-full overflow-y-auto">
    <div class="header">
      {{ $t('DAO.About') }}
    </div>

    <!-- Information -->
    <div class="section">
      <div class="title">
        {{ $t('DAO.Information') }}
      </div>
      <div class="content">
        <div class="information-list">
          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Website') }}</div>
            <div class="cont">MetaDao https://metadao.ooo</div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Introduction') }}</div>
            <div class="cont">
              MetaDao是基于MetaID的DAO聚合空间，用户可以在上面发起DAO空间，加入感兴趣的DAO，参与DAO的讨论，发起议题，参加投票，在DAO空间发起任务或赚取对应的DAO币。
              本Dao是讨论和推动MetaDao这个项目而设立的Dao空间，我们在这里一起讨论怎么完善这个MetaDao的功能。以后MetaDao长怎样你说了算。
            </div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Mission Introduction') }}</div>
            <div class="cont">
              推动MetaDao成为区块链领域最大的的Dao工具
            </div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Type') }}</div>
            <div class="cont">
              项目
            </div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Clause') }}</div>
            <div class="cont">
              不能发表违反当地法律法规的言论和议题 一般提案超过50%为通过 重大议案超过66.6%
              投票为通过 一个mc一个voting power 最低有效投票人数为20个
            </div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Need Token Min') }}</div>
            <div class="cont">
              <ElTag>131313</ElTag>
            </div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Proposal Need Token Min') }}</div>
            <div class="cont">
              <ElTag>131313</ElTag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Administrators -->
    <div class="section">
      <div class="title">{{ $t('DAO.Administrators') }}</div>
      <div class="content">
        <div class="list">
          <div class="item">
            <div class="user flex flex-align-center">
              <UserAvatar :meta-id="''" :name="''" :image="''" :meta-name="''" />
              <div class="flex1">
                <div class="name">UPKJUI</div>
                <div class="metaid">MetaID: 6d5465</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Core Members -->
    <div class="section">
      <div class="title">{{ $t('DAO.Core Members') }}</div>
      <div class="content">
        <div class="list">
          <div class="item">
            <div class="user flex flex-align-center">
              <UserAvatar :meta-id="''" :name="''" :image="''" :meta-name="''" />
              <div class="flex1">
                <div class="name">UPKJUI</div>
                <div class="metaid">MetaID: 6d5465</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Core Members -->
    <div class="section">
      <div class="title">{{ $t('DAO.Members') }}</div>
      <div class="content">
        <div class="list">
          <div class="item">
            <div class="user flex flex-align-center">
              <UserAvatar :meta-id="''" :name="''" :image="''" :meta-name="''" />
              <div class="flex1">
                <div class="name">UPKJUI</div>
                <div class="metaid">MetaID: 6d5465</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'
</script>

<style lang="scss" scoped src="./About.scss"></style>
