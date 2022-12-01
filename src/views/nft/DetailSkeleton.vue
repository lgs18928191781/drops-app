<template>
  <div class="top flex container">
    <!-- {{ nft.val.coverUrl }} -->
    <ElSkeletonItem class="cover" variant="image" />
    <div class="cont flex1 flex flex-v">
      <div class="name flex flex-align-center">
        <ElSkeletonItem class="text" variant="text" style="width: 80%" />
      </div>
      <div class="creater-msg">
        <div class="author flex flex-align-center">
          <ElSkeletonItem variant="image" class="avatar" />
          <div class="author-msg flex1">
            <ElSkeletonItem class="creater" variant="text" />
            <ElSkeletonItem class="metaid" variant="text" />
          </div>
        </div>
        <div class="cert">
          <ElSkeletonItem class="text " variant="text" style="width: 20%" />
        </div>
      </div>
      <div class="drsc flex1 flex flex-v">
        <ElSkeletonItem class="title" variant="h1" />
        <div class="cont flex1">
          <ElSkeletonItem variant="text" style="width: 80%" />
          <ElSkeletonItem variant="text" style="width: 60%; margin-top: 15px;" />
          <ElSkeletonItem variant="text" style="width: 40%; margin-top: 15px;" />
        </div>
      </div>

      <div class="timeleft">
        <ElSkeletonItem variant="text" />
      </div>
      <div class="operate-warp">
        <ElSkeletonItem class="btn btn-block" variant="button" />
      </div>
    </div>
  </div>
  <div class="bottom">
    <div class="bottom-warp">
      <div class="tab">
        <ElSkeletonItem variant="text" />
        <ElSkeletonItem variant="text" />
      </div>
      <div class="tab-cont">
        <!-- 作品细节 -->
        <div class="work-deail" v-if="tabIndex === 0">
          <div class="work-deail-section">
            <div class="work-detail-item flex flex-align-center">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
            <div class="work-detail-item flex flex-align-center">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
            <div class="work-detail-item flex flex-align-baseline">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
          </div>
          <div class="work-deail-section">
            <div class="work-detail-item flex flex-align-center">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
            <div class="work-detail-item flex flex flex-align-baseline">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
            <div class="work-detail-item flex flex-align-center">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
          </div>
          <div class="work-deail-section">
            <div class="work-detail-item flex flex-align-center">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
            <div class="work-detail-item flex flex-align-center">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
          </div>
          <div class="work-deail-section">
            <div class="work-detail-item flex flex-align-center">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
            <div class="work-detail-item flex flex-align-center" v-if="nft.val.type === '3'">
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
            <div class="work-detail-item flex flex-align-center" v-else>
              <ElSkeletonItem class="key" variant="text" />
              <ElSkeletonItem class="value flex1" variant="text" />
            </div>
          </div>

          <div class="remark">
            <div class="remark-item">
              <ElSkeletonItem variant="text" />
            </div>
            <div class="remark-item">
              <ElSkeletonItem variant="text" />
            </div>
            <div class="remark-item">
              <ElSkeletonItem variant="text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./DetailSkeleton.scss"></style>
