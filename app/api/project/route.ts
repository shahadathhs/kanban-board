import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();
  const projects = await Project.find();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const project = await Project.create(body);
  return NextResponse.json(project);
}

export async function DELETE(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { id } = body;
  const project = await Project.findByIdAndDelete(id);
  return NextResponse.json(project);
}

export async function PATCH(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { id } = body;
  const project = await Project.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(project);
}
