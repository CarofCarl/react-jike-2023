import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "./index.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState, useRef } from "react";
import {
  createArticleAPI,
  getArticleById,
  updateArticleAPI,
} from "@/apis/article";
import { useChannel } from "@/hooks/useChannel";

const { Option } = Select;

const Publish = () => {
  // 获取频道列表
  const { channelList } = useChannel();
  const navigate = useNavigate();

  // 提交表单
  const onFinish = (formValue) => {
    console.log(formValue);
    // 校验封面类型imageType是否和实际的图片列表imageList数量是相等的
    if (imageList.length !== imageType)
      return message.warning("封面类型和图片数量不匹配");
    const { title, content, channel_id } = formValue;
    // 1. 按照接口文档的格式处理收集到的表单数据
    const reqData = {
      title,
      content,
      cover: {
        type: imageType, // 封面模式
        // 这里的url处理逻辑只是在新增时候的逻辑
        // 编辑的时候需要做处理
        images: imageList.map((item) => {
          if (item.response) {
            return item.response.data.url;
          } else {
            return item.url;
          }
        }), // 图片列表
      },
      channel_id,
    };
    // 2. 调用接口提交
    // 处理调用不同的接口 新增 - 新增接口  编辑状态 - 更新接口  id
    const promise = articleId
      ? updateArticleAPI({ ...reqData, id: articleId }) // 更新接口
      : createArticleAPI(reqData); // 新增接口

    promise
      .then(() => {
        message.success(`${articleId ? "更新" : "发布"}文章成功`);
        navigate("/article");
      })
      .catch((err) => {
        message.error(`${articleId ? "更新" : "发布"}文章失败`);
      });
  };

  // 创建暂存仓库，用于存储所有已上传的图片
  const imageStoreRef = useRef([]);

  // 上传图片
  const [imageList, setImageList] = useState([]);
  const onChange = (value) => {
    // 更新当前显示的图片列表
    setImageList(value.fileList);

    // 同时更新暂存仓库中的图片
    imageStoreRef.current = value.fileList;
  };

  // 切换图片封面类型
  const [imageType, setImageType] = useState(0);
  const onTypeChange = (e) => {
    const newType = e.target.value;
    console.log("切换封面了", newType);
    setImageType(newType);
    // 根据类型从暂存仓库中选择要显示的图片
    if (newType === 0) {
      // 无图模式，清空显示的图片列表
      setImageList([]);
    } else if (newType === 1) {
      // 单图模式，只显示第一张图片（如果有）
      setImageList(
        imageStoreRef.current.length > 0 ? [imageStoreRef.current[0]] : []
      );
    } else if (newType === 3) {
      // 三图模式，显示所有图片（最多三张）
      setImageList(imageStoreRef.current.slice(0, 3));
    }
  };

  // 回填数据
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("id");
  // 获取实例
  const [form] = Form.useForm();
  useEffect(() => {
    // 1. 通过id获取数据
    async function getArticleDetail() {
      const res = await getArticleById(articleId);
      const { cover, ...formData } = res.data;

      // 回填表单数据（包括封面类型）
      form.setFieldsValue({
        ...formData,
        type: cover.type,
      });

      // 回填封面类型
      setImageType(cover.type);

      // 处理图片数据格式 - 将 URL 字符串数组转换为上传组件需要的格式
      const imageData = cover.images.map((url) => ({ url }));

      // 更新暂存仓库
      imageStoreRef.current = imageData;

      // 更新当前显示的图片列表
      setImageList(imageData);
    }

    // 只有有id的时候才能调用此函数回填
    if (articleId) {
      getArticleDetail();
    }
  }, [articleId, form]);

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: `${articleId ? "编辑" : "发布"}文章` },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {/* value属性用户选中之后会自动收集起来作为接口的提交字段 */}
              {channelList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 
              listType: 决定选择文件框的外观样式
              showUploadList: 控制显示上传列表
            */}
            {imageType > 0 && (
              <Upload
                listType="picture-card"
                showUploadList
                action={"http://geek.itheima.net/v1_0/upload"}
                name="image"
                onChange={onChange}
                maxCount={imageType}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? "更新文章" : "发布文章"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
